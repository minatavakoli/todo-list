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


  const [todoValue, setTodoValue] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [newText, setNewText] = useState("");

  const [filteredTodoList, setFilteredTodoList] = useState<TodoListTypes[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");

  // useEffect(() => {
  //   if (getTododsQuery.data) {
  //     if (filterStatus === "all") {
  //       setFilteredTodoList(getTododsQuery.data);
  //     } else if (filterStatus === "active") {
  //       const result = getTododsQuery.data.filter((item) => !item.isComplete);
  //       setFilteredTodoList(result);
  //     } else if (filterStatus === "completed") {
  //       const result = getTododsQuery.data.filter((item) => item.isComplete);
  //       setFilteredTodoList(result);
  //     }
  //   }
  // }, [filterStatus, getTododsQuery.data]);


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
            // getTododsQuery.data?.filter((item) => {
            //   return !item.isComplete;
            // }).length
          }{" "}
          item left
        </Box>
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
