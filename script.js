const imageUpload = document.getElementById('imageUpload');
const colorPicker = document.getElementById('colorPicker');
const playButton = document.getElementById('playButton');
const gameModal = document.getElementById('gameModal');
const closeModal = document.getElementById('closeModal');
const modalImageContainer = document.getElementById('modalImageContainer');

let image, blocks = [], revealInterval;

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
     // image.style.position = 'absolute';

      image.onload = () => {
        console.log('Image successfully loaded.');
      };
    };
    reader.readAsDataURL(file);
  }
});

// Handle play button click
// Adjust the modal container dimensions dynamically
playButton.addEventListener('click', () => {
  if (!image) {
    alert('Please upload an image first!');
    return;
  }

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

  // Ensure the modal fits exactly
  modalImageContainer.style.width = `${scaledWidth}px`;
  modalImageContainer.style.height = `${scaledHeight}px`;
  modalImageContainer.style.position = 'relative';

  // Set scaled image dimensions
  image.style.width = `${scaledWidth}px`;
  image.style.height = `${scaledHeight}px`;

  // Create hidden blocks overlay
  createHiddenBlocks(scaledWidth, scaledHeight);

  // Append blocks to the modal
  blocks.forEach(block => modalImageContainer.appendChild(block));

  // Show the modal
  gameModal.style.display = 'block';

  // Start revealing blocks
  if (revealInterval) clearInterval(revealInterval);
  revealInterval = setInterval(revealBlock, 100);
});


// Close the modal
closeModal.addEventListener('click', () => {
  gameModal.style.display = 'none';
  clearInterval(revealInterval); // Stop the game when modal closes
});

// Ensure modal hides on outside click
window.addEventListener('click', (event) => {
  if (event.target === gameModal) {
    gameModal.style.display = 'none';
    clearInterval(revealInterval); // Stop the game
  }
});

// Create hidden blocks overlay
function createHiddenBlocks(imageWidth, imageHeight) {
  blocks = [];
  const blockSize = 30; // Size of each block in pixels
  const rows = Math.ceil(imageHeight / blockSize);
  const cols = Math.ceil(imageWidth / blockSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = document.createElement('div');
      block.classList.add('hidden-block');
      block.style.width = `${blockSize}px`;
      block.style.height = `${blockSize}px`;
      block.style.left = `${col * blockSize}px`;
      block.style.top = `${row * blockSize}px`;
      block.style.backgroundColor = colorPicker.value;
      block.style.position = 'absolute';
      blocks.push(block);
    }
  }
}

// Reveal a single block at random
function revealBlock() {
  if (blocks.length === 0) {
    clearInterval(revealInterval);
    return;
  }

  const randomIndex = Math.floor(Math.random() * blocks.length);
  const block = blocks.splice(randomIndex, 1)[0];
  block.remove();
}
