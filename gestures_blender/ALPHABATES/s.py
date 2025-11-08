import bpy, sys
import math

argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get args after '--'
output_path = argv[0] if argv else "output.mp4"
armature_name = "SMPLX-female"

finger_curl_angles = {
    'thumb': {
        'base': (53.1025, -37.8788, 13.8171),
        'mid': (41.5762, -21.6091, -18.4754),
        'tip': (0.0, 0.0, 0.0)
    },
    'index': {
        'base': (8.35737, -13.8387, 107.91),
        'mid': (-21.6329, 6.27794, 90.6425),
        'tip': (0.0, 0.0, 0.0)
    },
    'middle': {
        'base': (-2.34444, 1.58342, 117.25),
        'mid': (-3.82155, 15.6325, 65.0085),
        'tip': (-10.4938, 1.60775, 35.0074)
    },
    'ring': {
        'base': (-3.81754, 29.9166,115.808),
        'mid': (-29.6646, 0.18522, 42.1621),
        'tip': (-31.6658, 9.4997, 76.2459)
    },
    'pinky': {
        'base': (70.0555, 42.0074, 131.665),
        'mid': (-100.119, 61.5658, -41.1688),
        'tip': (-6.18274, 6.86485, 1.80795)
    }
}

# --- Mapping dict finger -> SMPLX bone names ---
finger_to_bones = {
    'thumb': ["right_thumb1", "right_thumb2", "right_thumb3"],
    'index': ["right_index1", "right_index2", "right_index3"],
    'middle': ["right_middle1", "right_middle2", "right_middle3"],
    'ring': ["right_ring1", "right_ring2", "right_ring3"],
    'pinky': ["right_pinky1", "right_pinky2", "right_pinky3"]
}

# --- Setup Armature ---
obj = bpy.data.objects[armature_name]
obj.animation_data_clear()
bpy.context.view_layer.objects.active = obj
bpy.ops.object.mode_set(mode='POSE')

# --- Right arm bones ---
shoulder = obj.pose.bones["right_shoulder"]
elbow = obj.pose.bones["right_elbow"]

# --- Reset and start animation ---
shoulder.rotation_mode = 'XYZ'
shoulder.rotation_euler = (0, 0, math.radians(60))
shoulder.keyframe_insert(data_path="rotation_euler", frame=1)

elbow.rotation_mode = 'XYZ'
elbow.rotation_euler = (0, 0, math.radians(40))
elbow.keyframe_insert(data_path="rotation_euler", frame=1)

# --- Arm raising (frames 1–20) ---
shoulder.rotation_euler = (0, math.radians(90), 0.2)
shoulder.keyframe_insert(data_path="rotation_euler", frame=20)

elbow.rotation_euler = (math.radians(-1.38494), math.radians(12.9444), math.radians(-93.5018))
elbow.keyframe_insert(data_path="rotation_euler", frame=20)

# --- Keep fixed pose until frame 60 ---
shoulder.keyframe_insert(data_path="rotation_euler", frame=60)
elbow.keyframe_insert(data_path="rotation_euler", frame=60)

# --- Lower arm (frames 60–90) ---
shoulder.rotation_euler = (0, 0, math.radians(60))
shoulder.keyframe_insert(data_path="rotation_euler", frame=90)

elbow.rotation_euler = (0, 0, math.radians(40))
elbow.keyframe_insert(data_path="rotation_euler", frame=90)

# --- Apply finger positions ---
for finger, joints in finger_curl_angles.items():
    bone_names = finger_to_bones[finger]
    for (joint, angles), bone_name in zip(joints.items(), bone_names):
        if bone_name in obj.pose.bones:
            bone = obj.pose.bones[bone_name]
            bone.rotation_mode = 'XYZ'

            # Frame 1 -> zero (relaxed)
            bone.rotation_euler = (0.0, 0.0, 0.0)
            bone.keyframe_insert(data_path="rotation_euler", frame=1)

            # Frame 20 -> target position
            bone.rotation_euler = tuple(math.radians(a) for a in angles)
            bone.keyframe_insert(data_path="rotation_euler", frame=20)

            # Frame 60 -> hold
            bone.rotation_euler = tuple(math.radians(a) for a in angles)
            bone.keyframe_insert(data_path="rotation_euler", frame=60)

            # Frame 90 -> back to zero
            bone.rotation_euler = (0.0, 0.0, 0.0)
            bone.keyframe_insert(data_path="rotation_euler", frame=90)


# ============================
# BACKGROUND SETUP
# ============================

# --- Option 1: World background image (always behind character)
def set_world_background(img_path):
    bpy.context.scene.world.use_nodes = True
    nodes = bpy.context.scene.world.node_tree.nodes
    links = bpy.context.scene.world.node_tree.links

    # Clear existing nodes
    for node in nodes:
        nodes.remove(node)

    # Create nodes
    tex_image = nodes.new(type="ShaderNodeTexImage")
    tex_image.image = bpy.data.images.load(img_path)

    bg_node = nodes.new(type="ShaderNodeBackground")
    output = nodes.new(type="ShaderNodeOutputWorld")

    tex_coord = nodes.new(type="ShaderNodeTexCoord")
    mapping = nodes.new(type="ShaderNodeMapping")

    # Link nodes
    links.new(tex_coord.outputs["Window"], mapping.inputs["Vector"])
    links.new(mapping.outputs["Vector"], tex_image.inputs["Vector"])
    links.new(tex_image.outputs["Color"], bg_node.inputs["Color"])
    links.new(bg_node.outputs["Background"], output.inputs["Surface"])

    # Set mapping to avoid stretching
    mapping.inputs['Scale'].default_value = (1, 1, 1)

bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
bpy.context.scene.render.image_settings.file_format = 'FFMPEG'
bpy.context.scene.render.ffmpeg.format = 'MPEG4'
bpy.context.scene.render.filepath = output_path
set_world_background("/Users/shahnawajrangrej/Desktop/AI_Alliance/gestures_blender/ALPHABATES/public/bg_blender.png")
bpy.ops.render.render(animation=True)