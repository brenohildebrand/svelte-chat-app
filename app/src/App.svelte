<script lang="ts">
  import { io } from 'socket.io-client'

  const socket = io();
  
  let isReadyToChat = false;
  let messages = [];

  const handleSubmitNickname = (e: Event) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const nickname = form.elements['nickname'].value;

    // Send nick to the server!
    socket.emit('chat-nickname', nickname);
  }

  const handleSubmitMessage = (e: Event) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const message = form.elements['message'].value;

    // Reset field
    form.elements['message'].value = '';

    // Send message to the server!
    socket.emit('chat-message', message);
  }

  socket.on('chat-nickname', function enterChatRoom() {
    // Enter chat room
    isReadyToChat = true;

    console.log('[CLIENT] Entering the chat room.');
  });

  socket.on('chat-message', function updateMessages({ nickname, message, color }) {
    // Send message
    messages = [...messages, { nickname, message, color }];
    console.log('[CLIENT] New message received!');
  }) 

</script>

<!-- App -->
{#if isReadyToChat}
  <section class="chat">
    {#each messages as { nickname, message, color } }
      <span style={`color: ${color};`} >{nickname}</span>
      <p>{message}</p>
    {/each}
  </section>
  <form on:submit={handleSubmitMessage} class="form-message">
    <input type="text" name="message">    
    <label for="message">write a message</label>
  </form>
{:else}
  <form on:submit={handleSubmitNickname} class="form-nickname">
    <input type="text" name="nickname">
    <label for="nickname">enter a nick</label>
  </form>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 80vw;
    max-width: 300px;
  }

  .form-nickname {
    position: absolute;
    transform: translate(-50%, -50%);

    top: 50%;
    left: 50%;
  }

  .form-message {
    margin: auto;
    width: 80vw;
    max-width: 600px;
  }

  .chat {
    width: 80vw;
    max-width: 600px;

    height: 70vh;
    max-height: 600px;

    margin: auto;
    margin-top: 10vh;
    margin-bottom: 50px;

    overflow: auto;
  }

  input {
    outline: none;
    border: none;
    border-bottom: 2px solid black;

    width: 100%;
  
    font-size: 1rem;

    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  label {
    width: 100%;
    text-align: left;

    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: bold;
    letter-spacing: 2px;
  }

  span {
    font-size: 1rem;
    font-weight: bold;
  }

  p {
    margin-top: 10px;
    margin-bottom: 40px;

    white-space: normal;
  }
</style>