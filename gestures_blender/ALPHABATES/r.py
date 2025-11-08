import bpy,sys
import math

argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get args after '--'
output_path = argv[0] if argv else "output.mp4"
armature_name = "SMPLX-female"

finger_curl_angles = {
    'thumb': {
        'base': (55.6851, -8.28035, 2.63424),
        'mid': (48.9937, -62.5446, -19.2422),
        'tip': (0.0, 0.0, 0.0)
    },
    'index': {
        'base': (0.801717, -12.954, -0.227184),
        'mid': (0.531472, -8.72545, -0.132044),
        'tip': (0.0, 0.0, 0.0)
    },
    'middle': {
        'base': (4.32638, 26.6686, -20.2875),
        'mid': (0.0, 0.0, 0.0),
        'tip': (-39.6689, 27.5973, 86.374)
    },
    'ring': {
        'base': (1.51358, 36.8605, 91.7889),
        'mid': (-43.6026, 33.0572, 87.3101),
        'tip': (0.0, 0.0, 0.0)
    },
    'pinky': {
        'base': (0.0, 60, 90.0),
        'mid': (-81.5207, 31.0678, 32.2923),
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
#wrist = obj.pose.bones["right_wrist"]

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

#wrist.rotation_mode='XYZ'
#wrist.rotation_euler=(math.radians(-1.32418),math.radians(-51.273),math.radians(49.2489))
#wrist.keyframe_insert(data_path="rotation_euler",frame=20)

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