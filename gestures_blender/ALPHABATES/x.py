import bpy, sys
import math

argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get args after '--'
output_path = argv[0] if argv else "output.mp4"
armature_name = "SMPLX-female"

finger_curl_angles = {
    'thumb': {
        'base': (34.8653, 1.83249, 1.22066),
        'mid': (44.2009, -67.4751, 8.86845),
        'tip': (0.0, 0.0, 0.0)
    },
    'index': {
        'base': (0.0, 0.0, 0.0),
        'mid': (-19.0541, -29.6323, 66.5367),
        'tip': (-11.2822, -25.1669, 49.4865)
    },
    'middle': {
        'base': (-33.1525, -1.49441, 99.691),
        'mid': (-48.4684, -4.91292, 68.0457),
        'tip': (0.0, 0.0, 0.0)
    },
    'ring': {
        'base': (56.7577, 7.94185, 90.9202),
        'mid': (0-136.497, 71.8615, -54.6186),
        'tip': (-136.497, 71.8615, -54.6186)
    },
    'pinky': {
        'base': (67.4991, 42.3933, 103.927),
        'mid': (-89.1672, 53.871, -48.2031),
        'tip': (0.0, 0.0, 0.0)
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