const imageUpload = document.getElementById('imageUpload');
const colorPicker = document.getElementById('colorPicker');
const playButton = document.getElementById('playButton');
const gameModal = document.getElementById('gameModal');
const closeModal = document.getElementById('closeModal');
const modalImageContainer = document.getElementById('modalImageContainer');
const pauseButton = document.getElementById('pauseButton');
const skipButton = document.getElementById('skipButton');
const restartButton = document.getElementById('restartButton');

let image, blocks = [], revealInterval;
let paused = false;
let revealing = false;
let gameStarted = false;

// Default values for block size and speed
let blockSize = 30;
let revealSpeed = 100;

// Handle block size change
document.getElementById('blockSize').addEventListener('input', (event) => {
  blockSize = parseInt(event.target.value);
  if (gameStarted) {
    resetGame(); // Reset the game if already started to apply the new block size
  }
});

// Handle reveal speed change
document.getElementById('revealSpeed').addEventListener('input', (event) => {
  revealSpeed = parseInt(event.target.value);
  if (revealing) {
    clearInterval(revealInterval); // Stop the current reveal interval
    revealInterval = setInterval(revealBlock, revealSpeed); // Apply new speed
  }
});

// Handle image upload
imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Create and prepare the image
      image = new Image();
      image.src = e.target.result;
      image.style.zIndex = 1; // Ensure the image is below hidden blocks
      image.onload = () => {
        console.log('Image successfully loaded.');
      };
    };
    reader.readAsDataURL(file);
  }
});

// Handle play button click
playButton.addEventListener('click', () => {
  if (!image) {
    alert('Please upload an image first!');
    return;
  }

  if (!gameStarted) {
    // Move the image and blocks to the modal
    modalImageContainer.innerHTML = ''; // Clear previous content
    modalImageContainer.appendChild(image);

    // Scale the image to fit the modal
    const imgWidth = image.naturalWidth;
    const imgHeight = image.naturalHeight;

    const viewportWidth = window.innerWidth * 0.9; // Modal max width (90% of screen)
    const viewportHeight = window.innerHeight * 0.8; // Modal max height (80% of screen)

    const scaleFactor = Math.min(viewportWidth / imgWidth, viewportHeight / imgHeight);
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;

    // Set the modal container's exact size based on scaled image
    modalImageContainer.style.width = `${scaledWidth}px`;
    modalImageContainer.style.height = `${scaledHeight}px`;
    modalImageContainer.style.position = 'relative';

    // Set scaled image dimensions
    image.style.width = `${scaledWidth}px`;
    image.style.height = `${scaledHeight}px`;

    // Create hidden blocks overlay within the scaled image size
    createHiddenBlocks(scaledWidth, scaledHeight);

    // Append blocks to the modal
    blocks.forEach(block => modalImageContainer.appendChild(block));

    // Show the modal
    gameModal.style.display = 'block';

    gameStarted = true;
  }

  // Start revealing blocks if not already revealing
  if (!revealing) {
    revealInterval = setInterval(revealBlock, revealSpeed);
    revealing = true;
  }
});

// Close the modal
closeModal.addEventListener('click', () => {
  gameModal.style.display = 'none';
  clearInterval(revealInterval); // Stop the game when modal closes
  revealing = false;
  gameStarted = false; // Reset game state when modal is closed
});

// Ensure modal hides on outside click
window.addEventListener('click', (event) => {
  if (event.target === gameModal) {
    gameModal.style.display = 'none';
    clearInterval(revealInterval); // Stop the game
    revealing = false;
    gameStarted = false; // Reset game state when modal is closed
  }
});

// Create hidden blocks overlay
function createHiddenBlocks(imageWidth, imageHeight) {
  blocks = [];
  const rows = Math.ceil(imageHeight / blockSize);
  const cols = Math.ceil(imageWidth / blockSize);

  // Loop through and create blocks for each position in the grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = document.createElement('div');
      block.classList.add('hidden-block');
      
      // Set block size
      block.style.width = `${blockSize}px`;
      block.style.height = `${blockSize}px`;

      // Set position relative to the scaled image size
      block.style.left = `${col * blockSize}px`;
      block.style.top = `${row * blockSize}px`;

      // Set the background color of the block
      block.style.backgroundColor = colorPicker.value;

      // Set position absolute for overlaying the image
      block.style.position = 'absolute';
      block.style.display = 'block'; // Blocks are initially visible
      blocks.push(block);
    }
  }
}

// Reveal a single block at random by hiding it
function revealBlock() {
  if (blocks.length === 0) {
    clearInterval(revealInterval);
    revealing = false;
    return;
  }

  const randomIndex = Math.floor(Math.random() * blocks.length);
  const block = blocks.splice(randomIndex, 1)[0];
  block.style.display = 'none'; // Hide the block instead of removing it
}

// Pause and Resume Button
pauseButton.addEventListener('click', () => {
  if (paused) {
    revealInterval = setInterval(revealBlock, revealSpeed); // Resume revealing blocks
    pauseButton.textContent = 'Pause';
  } else {
    clearInterval(revealInterval); // Pause the revealing of blocks
    pauseButton.textContent = 'Resume';
  }
  paused = !paused;
});

// Skip to End Button
skipButton.addEventListener('click', () => {
  clearInterval(revealInterval); // Stop revealing
  revealing = false;
  blocks.forEach(block => block.style.display = 'none'); // Hide all blocks instead of removing them
});

// Restart Button
restartButton.addEventListener('click', () => {
  // Reset the game state
  resetGame();
});

// Reset game
function resetGame() {
  clearInterval(revealInterval);
  revealing = false;
  blocks.forEach(block => block.style.display = 'none'); // Hide all blocks instead of removing them
  blocks = []; // Empty the blocks array before recreating

  // Recreate and append the blocks
  const imgWidth = image.naturalWidth;
  const imgHeight = image.naturalHeight;

  const viewportWidth = window.innerWidth * 0.9; // Modal max width (90% of screen)
  const viewportHeight = window.innerHeight * 0.8; // Modal max height (80% of screen)

  const scaleFactor = Math.min(viewportWidth / imgWidth, viewportHeight / imgHeight);
  const scaledWidth = imgWidth * scaleFactor;
  const scaledHeight = imgHeight * scaleFactor;

  createHiddenBlocks(scaledWidth, scaledHeight);
  blocks.forEach(block => modalImageContainer.appendChild(block));

  // Start the reveal process again
  revealInterval = setInterval(revealBlock, revealSpeed);
  revealing = true;
  paused = false;
  pauseButton.textContent = 'Pause'; // Reset button text
}
