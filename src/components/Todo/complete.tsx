import { EditIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { TodoListTypes } from "./types";

const TodoList = () => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getTododsQuery = useQuery(
    ["todos"],
    () => {
      return axios
        .get<TodoListTypes[]>(
          "https://627259b3c455a64564bfb279.mockapi.io/api/v1/todos"
        )
        .then((response) => response.data);
    },
    {
      // cacheTime
      // initialData
      // onError
      // onSuccess
      // onSettled
      // refetchInterval
      refetchOnWindowFocus: false,
      // retry
      // select
    }
  );

  const addTodoMutation = useMutation(
    (newTodo: { text: string; isComplete: boolean }) => {
      return axios.post(
        "https://627259b3c455a64564bfb279.mockapi.io/api/v1/todos",
        newTodo
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["todos"]);
      },
    }
  );

  const deleteTodoMutation = useMutation(
    ({ id }: { id: string }) => {
      return axios.delete(
        `https://627259b3c455a64564bfb279.mockapi.io/api/v1/todos/${id}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["todos"]);
      },
    }
  );

  const editTodoMutation = useMutation(
    (data: { id: string; text?: string; isComplete?: boolean }) => {
      return axios.put(
        `https://627259b3c455a64564bfb279.mockapi.io/api/v1/todos/${data.id}`,
        data
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["todos"]);
      },
    }
  );

  const [todoValue, setTodoValue] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [newText, setNewText] = useState("");

  const [filteredTodoList, setFilteredTodoList] = useState<TodoListTypes[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");

  useEffect(() => {
    if (getTododsQuery.data) {
      if (filterStatus === "all") {
        setFilteredTodoList(getTododsQuery.data);
      } else if (filterStatus === "active") {
        const result = getTododsQuery.data.filter((item) => !item.isComplete);
        setFilteredTodoList(result);
      } else if (filterStatus === "completed") {
        const result = getTododsQuery.data.filter((item) => item.isComplete);
        setFilteredTodoList(result);
      }
    }
  }, [filterStatus, getTododsQuery.data]);

  if (getTododsQuery.isLoading) {
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <Box mt="100px" w="600px" bg="#fff">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            addTodoMutation.mutate({ text: todoValue, isComplete: false });
            setTodoValue("");
          }}
        >
          <Input
            onChange={(e) => {
              setTodoValue(e.target.value);
            }}
            placeholder="Create a new todo..."
            value={todoValue}
          />
        </form>
      </Box>

      {getTododsQuery.isLoading ? (
        <Center mt="2">
          <Spinner />
        </Center>
      ) : (
        <Box
          width="600px"
          display="flex"
          mt="20px"
          background={"white"}
          padding="1rem"
          borderRadius={"1rem"}
        >
          <Box w="100%">
            {filteredTodoList.map((item) => (
              <Box
                p="10px"
                w="100%"
                borderBottom="1px solid #eee"
                key={item.text}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box gap="5px" display="flex">
                  <Checkbox
                    isChecked={item.isComplete}
                    onChange={(e) => {
                      editTodoMutation.mutate({
                        isComplete: !item.isComplete,
                        id: item.id,
                      });
                    }}
                  ></Checkbox>
                  <Text
                    textDecoration={item.isComplete ? "line-through" : "none"}
                  >
                    {item.text}{" "}
                  </Text>
                </Box>

                <Box display={"flex"}>
                  <IconButton
                    onClick={() => {
                      deleteTodoMutation.mutate({ id: item.id });
                    }}
                    aria-label="Search database"
                    icon={<SmallCloseIcon />}
                  />

                  <IconButton
                    aria-label="Search database"
                    icon={<EditIcon />}
                    colorScheme="blue"
                    ml="10px"
                    onClick={() => {
                      onOpen();
                      setSelectedId(item.id);
                      setNewText(item.text);
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box
        width="600px"
        display="flex"
        mt="20px"
        background={"white"}
        padding="1rem"
        borderRadius={"1rem"}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          {" "}
          {
            getTododsQuery.data?.filter((item) => {
              return !item.isComplete;
            }).length
          }{" "}
          item left
        </Box>
        {/* <Button
          onClick={() => {
            setTodoList([]);
          }}
          colorScheme="teal"
          variant="solid"
        >
          Clear All
        </Button> */}
      </Box>
      <Box
        width="600px"
        display="flex"
        mt="20px"
        background={"white"}
        padding="1rem"
        borderRadius={"1rem"}
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          colorScheme={filterStatus === "all" ? "blue" : "gray"}
          variant="ghost"
          onClick={() => {
            setFilterStatus("all");
          }}
        >
          All
        </Button>
        <Button
          colorScheme={filterStatus === "active" ? "blue" : "gray"}
          variant="ghost"
          onClick={() => {
            setFilterStatus("active");
          }}
        >
          Active
        </Button>
        <Button
          colorScheme={filterStatus === "completed" ? "blue" : "gray"}
          variant="ghost"
          onClick={() => {
            setFilterStatus("completed");
          }}
        >
          Completed
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Text</FormLabel>
              <Textarea
                placeholder="Text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                editTodoMutation.mutate({ id: selectedId, text: newText });
                setNewText("");
                onClose();
              }}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TodoList;
