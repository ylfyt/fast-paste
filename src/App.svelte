<script lang="ts">
  import Container from "./components/container.svelte";
  
  import Home from "./pages/home.svelte";
  
  </script>
  
  <main class="app">
    <Container>
      <Home />
    </Container>
  </main>
  
  <style>
    :global(:root) {
      --accent-color: rgba(204, 0, 0);
    }
  
    .app{
      min-height: 100vh;
      display: flex;
      justify-content: center;
      text-align: center;
    }
  </style>