import bpy, sys
import math

argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get args after '--'
output_path = argv[0] if argv else "output.mp4"
armature_name = "SMPLX-female"

# Bones for right arm
shoulder = "right_shoulder"
elbow = "right_elbow"
wrist = "right_wrist"

# Clear previous animation
obj = bpy.data.objects[armature_name]
obj.animation_data_clear()
bpy.context.view_layer.objects.active = obj
bpy.ops.object.mode_set(mode='POSE')
# bpy.ops.smplx.set_texture(texture="Female (UV 2021)")

# Reset all arm bones
spb = obj.pose.bones[shoulder]
spb.rotation_mode = 'XYZ'
spb.rotation_euler = (0, 0, math.radians(60))
spb.keyframe_insert(data_path="rotation_euler", frame=1)

epb =  obj.pose.bones[elbow]
epb.rotation_mode = 'XYZ'
epb.rotation_euler = (0,0 ,math.radians(40))
epb.keyframe_insert(data_path="rotation_euler", frame=1)

#wpb = obj.pose.bones[wrist]
#wpb.rotation_mode = 'XYZ'
#wpb.rotation_euler = (0, 0, 0)
#wpb.keyframe_insert(data_path="rotation_euler", frame=1)

# --- Raise arm forward (frames 1–20) ---
obj.pose.bones[shoulder].rotation_euler = (0, math.radians(90), 0.2)   # bring arm forward
obj.pose.bones[shoulder].keyframe_insert(data_path="rotation_euler", frame=20)

obj.pose.bones[elbow].rotation_euler = (0, 0, -2)     # bend elbow
obj.pose.bones[elbow].keyframe_insert(data_path="rotation_euler", frame=20)

# --- Hold arm steady in front while waving (frames 20–60) ---
# Shoulder + elbow stay fixed, only wrist moves
for f, x in [(30, 0.5), (40, -0.5), (50, 0.5), (60, -0.5)]:
    obj.pose.bones[wrist].rotation_euler = (0, x, 0)
    obj.pose.bones[wrist].keyframe_insert(data_path="rotation_euler", frame=f)

# Keep shoulder + elbow fixed during wave
obj.pose.bones[shoulder].rotation_euler = (0, math.radians(90), 0)
obj.pose.bones[shoulder].keyframe_insert(data_path="rotation_euler", frame=60)

obj.pose.bones[elbow].rotation_euler = (0, 0, -2)
obj.pose.bones[elbow].keyframe_insert(data_path="rotation_euler", frame=60)
material_name = "Female (UV 2021)"
# --- Lower arm back to rest (frames 60–90) ---
spb.rotation_euler = (0, 0, math.radians(60))
spb.keyframe_insert(data_path="rotation_euler", frame=90)
epb.rotation_euler = (0,0 ,math.radians(40))
epb.keyframe_insert(data_path="rotation_euler", frame=90)



bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
bpy.context.scene.render.image_settings.file_format = 'FFMPEG'
bpy.context.scene.render.ffmpeg.format = 'MPEG4'
bpy.context.scene.render.filepath = output_path
bpy.ops.render.render(animation=True)