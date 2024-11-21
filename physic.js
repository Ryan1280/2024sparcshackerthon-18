const canvas = document.getElementById('ballCanvas');
const ctx = canvas.getContext('2d');

// Resize the canvas to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ball properties
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 30,
    color: 'white',
    dx: 0, // Horizontal velocity
    dy: 0, // Vertical velocity
    gravity: 0.5, // Gravity acceleration
    friction: 0.9, // Energy loss when hitting the ground
    groundFriction: 0.95, // Friction on the ground
    airResistance: 0.99, // Slightly reduce speed in the air
    isDragging: false, // Ball dragging state
    lastMouseX: 0, // To calculate the velocity on release
    lastMouseY: 0,
    stopThreshold: 0.3, // Velocity threshold for stopping the ball
    bounceCount: 0, // Number of bounces
    maxBounces: 10 // Maximum number of bounces before stopping
};

// New scaling factor to make the units more realistic
const scaleFactor = canvas.width / 50; // This will now treat the canvas as 50 meters wide

// Variables to display speed, angle, and distance
let speed = 0;
let angle = 0;
let distance = 0;
let displayInfo = false;

// Event listeners for mouse interaction
canvas.addEventListener('mousedown', function (e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const distance = Math.hypot(mouseX - ball.x, mouseY - ball.y);

    // Check if the ball is clicked (within the ball's radius)
    if (distance < ball.radius) {
        ball.isDragging = true;
        ball.lastMouseX = mouseX;
        ball.lastMouseY = mouseY;
        ball.dx = 0; // Stop ball movement when grabbing
        ball.dy = 0;
        ball.bounceCount = 0; // Reset bounce count when the ball is picked up
        displayInfo = false; // Hide previous throw's information while dragging
    }
});

canvas.addEventListener('mousemove', function (e) {
    if (ball.isDragging) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Move the ball along with the mouse
        ball.x = mouseX;
        ball.y = mouseY;
    }
});

canvas.addEventListener('mouseup', function (e) {
    if (ball.isDragging) {
        // Calculate the velocity based on the difference between last and current mouse position
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        ball.dx = (mouseX - ball.lastMouseX) * 0.1; // Adjust factor to control throw speed
        ball.dy = (mouseY - ball.lastMouseY) * 0.1;

        // Calculate speed, angle, and distance
        speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) * scaleFactor; // Convert to meters/second
        angle = Math.atan2(ball.dy, ball.dx) * (180 / Math.PI); // Convert radians to degrees
        distance = Math.pow(speed, 2) / (2 * ball.gravity * scaleFactor); // Estimate distance in meters

        displayInfo = true; // Show the information after releasing the ball

        ball.isDragging = false; // Release the ball
    }
});

// Function to draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Function to display speed, angle, and distance
function displayThrowInfo() {
    if (displayInfo) {
        ctx.font = '18px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Speed: ${speed.toFixed(2)} m/s`, 20, 40);
        ctx.fillText(`Angle: ${angle.toFixed(2)}°`, 20, 60);
        ctx.fillText(`Estimated Distance: ${distance.toFixed(2)} m`, 20, 80);
    }
}

// Function to update the ball's position
function updateBall() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ball
    drawBall();

    // Display speed, angle, and distance info
    displayThrowInfo();

    if (!ball.isDragging) {
        // Update ball position based on velocity
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Apply air resistance to slightly reduce speed while in the air
        ball.dx *= ball.airResistance;
        ball.dy *= ball.airResistance;

        // Apply gravity
        ball.dy += ball.gravity;

        // Bounce off the bottom
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius; // Reposition to the bottom

            // Increment bounce count
            ball.bounceCount++;

            // Check if the bounce limit is reached
            if (ball.bounceCount >= ball.maxBounces) {
                // Stop the ball if it has bounced 10 times
                ball.dy = 0;
                ball.dx = 0;
            } else {
                // Check if the ball is moving slow enough to stop
                if (Math.abs(ball.dy) < ball.stopThreshold) {
                    // Stop the ball completely if it is slow
                    ball.dy = 0;
                    ball.dx = 0;
                } else {
                    // Bounce if it hasn't reached the stop threshold or bounce limit
                    ball.dy *= -ball.friction; // Reverse velocity with reduced energy (bounce)
                }
            }

            // Apply ground friction when the ball is on the ground
            ball.dx *= ball.groundFriction;
        }

        // Bounce off the top
        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius; // Reposition to the top
            ball.dy *= -ball.friction;
        }

        // Bounce off the sides
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx *= -ball.friction;
        }

        // Reposition to the left/right edge after collision
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
        }

        // Stop the ball when it's almost stationary on the ground (if it hasn't already stopped)
        if (Math.abs(ball.dy) < 0.1 && Math.abs(ball.y + ball.radius - canvas.height) < 1) {
            ball.dy = 0;
        }
    }

    // Call updateBall again for the next frame
    requestAnimationFrame(updateBall);
}

// Start the animation
updateBall();
