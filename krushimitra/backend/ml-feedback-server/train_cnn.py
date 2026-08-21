import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# 1. Path Setup
# This points to the 'dataset' folder you organized
dataset_path = 'dataset' 

# 2. Image Pre-processing & Augmentation
# We resize images to 224x224 and split them: 80% for training, 20% for testing
datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2, 
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True
)

train_gen = datagen.flow_from_directory(
    dataset_path,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='training'
)

val_gen = datagen.flow_from_directory(
    dataset_path,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='validation'
)

# 3. Save the Class Names
# We save the folder names to a text file so our API knows the order
classes = sorted(train_gen.class_indices.keys())
with open('classes.txt', 'w') as f:
    for item in classes:
        f.write(item + '\n')

# 4. Define the CNN Architecture
# This structure 'looks' at pixels to find shapes and disease spots
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(len(classes), activation='softmax') # Number of diseases
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# 5. Train the Model
# 5 Epochs is a good start. Accuracy should increase with each epoch.
print(f"🚀 Training started on {len(classes)} classes...")
model.fit(train_gen, validation_data=val_gen, epochs=5)

# 6. Save the Resulting 'Brain'
model.save('plant_model.h5')
print("✅ Training complete! 'plant_model.h5' and 'classes.txt' are created.")