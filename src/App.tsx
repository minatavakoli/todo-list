import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import TodoList from "./components/Todo";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <TodoList />
      </ChakraProvider>
    </div>
  );
}

export default App;
