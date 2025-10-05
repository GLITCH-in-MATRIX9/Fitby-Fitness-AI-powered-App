# ml-training/train_model.py
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Input, Dropout, BatchNormalization
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from sklearn.model_selection import train_test_split
import numpy as np

# --- Configuration for Dynamism and Robustness ---
NUM_FEATURES = 34
NUM_CLASSES = 1
L2_REG = 0.001
DROPOUT_RATE = 0.3 # New Hyperparameter for Dropout

# --- 1. Robust Data Generation and Preprocessing (with Test Split) ---
print("Generating and preprocessing data...")
# Increased data size again for better simulation
X_full = np.random.rand(1000, NUM_FEATURES) 
y_full = np.random.randint(0, 2, size=(1000, 1)) 

# Normalization
# Use the minimum and maximum of the FULL dataset to ensure consistency
X_min = np.min(X_full, axis=0)
X_max = np.max(X_full, axis=0)
X_normalized = (X_full - X_min) / (X_max - X_min + 1e-8)

# **Train-Validation-Test Split**: Essential for generalization and unbiased evaluation
# Split full data into Train+Validation (80%) and Test (20%)
X_train_val, X_test, y_train_val, y_test = train_test_split(
    X_normalized, y_full, test_size=0.2, random_state=42
)

# Split Train+Validation into final Train (60% of total) and Validation (20% of total)
X_train, X_val, y_train, y_val = train_test_split(
    X_train_val, y_train_val, test_size=0.25, random_state=42 # 0.25 * 0.8 = 0.2
)
print(f"Training samples: {len(X_train)}, Validation samples: {len(X_val)}, Test samples: {len(X_test)}")


# --- 2. Highly Robust Model Definition with Batch Norm and Dropout ---
def build_advanced_robust_model(input_shape, l2_reg, dropout_rate):
    """
    Adds BatchNormalization (stability) and Dropout (regularization) 
    to significantly reduce overfitting and improve generalization.
    """
    input_tensor = Input(shape=input_shape)

    # 1. Batch Normalization: Stabilizes learning and speeds up convergence
    x = BatchNormalization()(input_tensor) 

    # Hidden Layer 1
    x = Dense(128, kernel_regularizer=l2(l2_reg))(x)
    x = BatchNormalization()(x) # Normalize before activation (post-activation is also common)
    x = tf.keras.activations.relu(x)
    x = Dropout(dropout_rate)(x) # Dropout: Prevents co-adaptation of neurons

    # Hidden Layer 2
    x = Dense(64, kernel_regularizer=l2(l2_reg))(x)
    x = BatchNormalization()(x)
    x = tf.keras.activations.relu(x)
    x = Dropout(dropout_rate)(x)

    # Output layer
    output_tensor = Dense(NUM_CLASSES, activation="sigmoid")(x) 
    
    model = Model(inputs=input_tensor, outputs=output_tensor)
    return model

model = build_advanced_robust_model(
    input_shape=(NUM_FEATURES,), 
    l2_reg=L2_REG, 
    dropout_rate=DROPOUT_RATE
)

# --- 3. Robust Training Configuration with Advanced Callbacks ---
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="binary_crossentropy", 
    metrics=["accuracy"]
)

# Callbacks from previous version (EarlyStopping, ModelCheckpoint)
early_stopping = EarlyStopping(
    monitor='val_loss', patience=15, restore_best_weights=True, verbose=1
)

model_filepath = "squat_model_advanced_robust.h5"
model_checkpoint = ModelCheckpoint(
    filepath=model_filepath, monitor='val_loss', save_best_only=True, verbose=1
)

# **Reduce Learning Rate on Plateau**: Dynamically adjusts LR to escape local minima
reduce_lr = ReduceLROnPlateau(
    monitor='val_loss', 
    factor=0.5, # Reduce LR by 50%
    patience=7, 
    min_lr=1e-6, 
    verbose=1
)

print("Starting advanced robust model training...")
history = model.fit(
    X_train, 
    y_train, 
    epochs=200, # Increased epochs further
    batch_size=64, # Increased batch size for better Batch Norm performance
    validation_data=(X_val, y_val),
    callbacks=[early_stopping, model_checkpoint, reduce_lr],
    verbose=2
)

# --- 4. Final Evaluation on Holdout Test Set (Unbiased Robustness Check) ---
print("\n--- Final Model Evaluation ---")
# Load the best model saved by the ModelCheckpoint
best_model = tf.keras.models.load_model(model_filepath)
loss, acc = best_model.evaluate(X_test, y_test, verbose=0)
print(f"✅ Model trained and saved as {model_filepath}")
print(f"Test Loss: {loss:.4f}")
print(f"Test Accuracy (Unbiased): {acc:.4f}")