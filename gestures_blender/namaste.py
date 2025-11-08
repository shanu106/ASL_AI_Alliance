import bpy, sys
import math


argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get args after '--'
output_path = argv[0] if argv else "output.mp4"
armature_name = "SMPLX-female"
# Bone names (assuming SMPLX naming convention, adjust if needed)
L_shoulder = "left_shoulder"
L_elbow = "left_elbow"
L_wrist = "left_wrist"

R_shoulder = "right_shoulder"
R_elbow = "right_elbow"
R_wrist = "right_wrist"

# Clear previous animation
obj = bpy.data.objects[armature_name]
obj.animation_data_clear()
bpy.context.view_layer.objects.active = obj
bpy.ops.object.mode_set(mode='POSE')

# Reset positions
for bone in [L_shoulder, L_elbow, L_wrist, R_shoulder, R_elbow, R_wrist]:
    pb = obj.pose.bones[bone]
    pb.rotation_mode = 'XYZ'
    pb.rotation_euler = (0, 0, 0)
    pb.keyframe_insert(data_path="rotation_euler", frame=1)

# --- Bring both arms forward (frames 1–20) ---
# Move shoulders inward & forwar
obj.pose.bones[L_shoulder].rotation_euler = (math.radians(-21.967), math.radians(-123.2), math.radians(80.875))
obj.pose.bones[L_shoulder].keyframe_insert(data_path="rotation_euler", frame=20)

obj.pose.bones[R_shoulder].rotation_euler = (math.radians(-75.423), math.radians(112.53), math.radians(-63.499))
obj.pose.bones[R_shoulder].keyframe_insert(data_path="rotation_euler", frame=20)

# Bend elbows inward
obj.pose.bones[L_elbow].rotation_euler = (math.radians(-109.61), math.radians(26.047), math.radians(90.469))
obj.pose.bones[L_elbow].keyframe_insert(data_path="rotation_euler", frame=20)

obj.pose.bones[R_elbow].rotation_euler = (math.radians(-96.721), math.radians(38.48), math.radians(-77.043))
obj.pose.bones[R_elbow].keyframe_insert(data_path="rotation_euler", frame=20)

# Rotate wrists slightly so palms face each other
obj.pose.bones[L_wrist].rotation_euler = (math.radians(19.543), math.radians(-10.578), math.radians(31.37))
obj.pose.bones[L_wrist].keyframe_insert(data_path="rotation_euler", frame=20)

obj.pose.bones[R_wrist].rotation_euler = (math.radians(17.435), math.radians(-4.6065), math.radians(-23.471))
obj.pose.bones[R_wrist].keyframe_insert(data_path="rotation_euler", frame=20)

# --- Hold Namaste pose (frames 20–80) ---
for f in [40, 60, 80]:
    for bone in [L_shoulder, L_elbow, L_wrist, R_shoulder, R_elbow, R_wrist]:
        obj.pose.bones[bone].keyframe_insert(data_path="rotation_euler", frame=f)

# --- Return to rest (frames 80–100) ---
for bone in [L_shoulder, L_elbow, L_wrist, R_shoulder, R_elbow, R_wrist]:
    obj.pose.bones[bone].rotation_euler = (0, 0, 0)
    obj.pose.bones[bone].keyframe_insert(data_path="rotation_euler", frame=100)

# Render settings
bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
bpy.context.scene.render.image_settings.file_format = 'FFMPEG'
bpy.context.scene.render.ffmpeg.format = 'MPEG4'
bpy.context.scene.render.filepath = output_path
bpy.ops.render.render(animation=True)