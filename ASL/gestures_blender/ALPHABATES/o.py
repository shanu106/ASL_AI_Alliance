import bpy,sys
import math

argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get args after '--'
output_path = argv[0] if argv else "output.mp4"
armature_name = "SMPLX-female"

# --- Finger joint target angles (degrees) ---
finger_curl_angles = {
    'thumb': {
        'base': (64.4528, 2.18602, 3.32635),
        'mid': (0.0, 0.0, 0.0),
        'tip': (3.16933, -19.4922, -10.0367)
    },
    'index': {
        'base': (-1.43594, 0.889942, 66.2461),
        'mid': (-0.719658, 0.158994, 27.5859),
        'tip': (-1.33685, 0.71039, 58.6397)
    },
    'middle': {
        'base': (-1.58177, 1.5331, 90.879),
        'mid': (-0.141727, 0.0032, 5.25696),
        'tip': (-0.39691, 0.042307, 14.838)
    },
    'ring': {
        'base': (-1.5449, 1.20964, 78.7894),
        'mid': (-0.380679, 0.038501, 14.22),
        'tip': (-0.529805, 0.080583, 19.9662)
    },
    'pinky': {
        'base': (-1.53504, 1.16807, 77.2058),
        'mid': (-0.573843, 0.096175, 21.698),
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
wrist = obj.pose.bones["right_wrist"]

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

wrist.rotation_mode='XYZ'
wrist.rotation_euler=(math.radians(90.6126),math.radians(1.83524),math.radians(4.97778))
wrist.keyframe_insert(data_path="rotation_euler",frame=20)

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