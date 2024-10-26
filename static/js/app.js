async function populateModelsDropdown() {
    try {
      const response = await fetch('/api/models');
      const data = await response.json();
      const modelsDropdown = document.getElementById('modelsDropdown');
      data.models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelsDropdown.appendChild(option);
      });
      // Set default value to gpt-4o
      modelsDropdown.value = 'gpt-4o';
    } catch (error) {
      console.error('Error fetching models:', error);
      showToast('Error fetching models. Please try again later.');
    }
  }
  
  async function submitMessage() {
    const message = document.getElementById('inputMessage').value;
    const temperature = document.getElementById('temperature').value;
    const topP = document.getElementById('topP').value;
    const selectedModel = document.getElementById('modelsDropdown').value;
    
    // Clear the relevant text areas before new response loads
    document.getElementById('localDecodedMessage').value = '';
    document.getElementById('hiddenEncodedMessage').value = '';
    document.getElementById('foolsRavings').value = '';
    document.getElementById('gptDecodedMessage').value = '';
  
    // Show spinner and disable inputs
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('container').classList.add('disabled');
  
    try {
      const response = await fetch('/api/encode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, temperature, top_p: topP, model: selectedModel })
      });
      if (!response.ok) {
        throw new Error('Error from model response');
      }
      const result = await response.json();
      document.getElementById('localDecodedMessage').value = result.decoded;
      document.getElementById('hiddenEncodedMessage').value = result.encoded;
      document.getElementById('foolsRavings').value = result.encoded;
    } catch (error) {
      console.error('Error submitting message:', error);
      showToast('Error processing message. Please try again later.');
    } finally {
      // Hide spinner and enable inputs
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('container').classList.remove('disabled');
    }
  }
  
  async function decodeMessage() {
    const encodedMessage = document.getElementById('hiddenEncodedMessage').value;
    const temperature = document.getElementById('temperature').value;
    const topP = document.getElementById('topP').value;
    const selectedModel = document.getElementById('modelsDropdown').value;
  
    // Clear the relevant text area before new response loads
    document.getElementById('gptDecodedMessage').value = '';
  
    // Show spinner and disable inputs
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('container').classList.add('disabled');
  
    try {
      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ encodedMessage, temperature, top_p: topP, model: selectedModel })
      });
      if (!response.ok) {
        throw new Error('Error from model response');
      }
      const result = await response.json();
      document.getElementById('gptDecodedMessage').value = result.decoded;
    } catch (error) {
      console.error('Error decoding message:', error);
      showToast('Error decoding message. Please try again later.');
    } finally {
      // Hide spinner and enable inputs
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('container').classList.remove('disabled');
    }
  }
  
  async function doSomethingWeird() {
    showToast('✨ You Found A Secret ✨');
    // document.body.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  
    // Generate a cryptic ancient riddle and display it in the Fool's Ravings area
    const temperature = document.getElementById('temperature').value;
    const topP = document.getElementById('topP').value;
  
    try {
      const response = await fetch('/api/riddle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ temperature, top_p: topP })
      });
      if (!response.ok) {
        throw new Error('Error generating riddle');
      }
      const result = await response.json();
      document.getElementById('foolsRavings').value = result.riddle;
    } catch (error) {
      console.error('Error generating riddle:', error);
      showToast('Error generating riddle. Please try again later.');
    }
  }
  
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'show';
    setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
  }
  
  function toggleControls() {
    const controls = document.getElementById('controls');
    const boite = document.getElementById('boite-diabolique');
    if (controls.classList.contains('show')) {
      controls.classList.remove('show');
      boite.querySelector('::after').textContent = '⬇️';
    } else {
      controls.classList.add('show');
      boite.querySelector('::after').textContent = '⬆️';
    }
  }
  
  document.addEventListener('DOMContentLoaded', populateModelsDropdown);
  