let steps = 0;
let calories = 0;
let weight = 0;
let isCounting = false;
let lastAcceleration = { x: 0, y: 0, z: 0 };
let stepThreshold = 1.2; // Adjust for sensitivity

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    
    if (weight && age && gender) {
        document.getElementById('userForm').style.display = 'none';
        document.getElementById('counter').style.display = 'block';
        startStepCounting();
    }
});

document.getElementById('stopBtn').addEventListener('click', function() {
    stopStepCounting();
    document.getElementById('counter').style.display = 'none';
    document.getElementById('userForm').style.display = 'block';
});

function startStepCounting() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                    isCounting = true;
                } else {
                    alert('Permission denied. Cannot access accelerometer.');
                }
            })
            .catch(console.error);
    } else {
        // For browsers that don't require permission
        window.addEventListener('devicemotion', handleMotion);
        isCounting = true;
    }
}

function stopStepCounting() {
    window.removeEventListener('devicemotion', handleMotion);
    isCounting = false;
    steps = 0;
    calories = 0;
    updateDisplay();
}

function handleMotion(event) {
    if (!isCounting) return;
    
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;
    
    const { x, y, z } = acceleration;
    const magnitude = Math.sqrt(x*x + y*y + z*z);
    const delta = Math.abs(magnitude - Math.sqrt(lastAcceleration.x*lastAcceleration.x + lastAcceleration.y*lastAcceleration.y + lastAcceleration.z*lastAcceleration.z));
    
    if (delta > stepThreshold) {
        steps++;
        calories = steps * 0.57 * (weight / 70);
        updateDisplay();
    }
    
    lastAcceleration = { x, y, z };
}

function updateDisplay() {
    document.getElementById('steps').textContent = steps;
    document.getElementById('calories').textContent = calories.toFixed(2);
}
