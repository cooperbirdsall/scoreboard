import './App.css'
import { useState, useRef } from 'react';
import { Button, Flex, Text, TextInput, Tabs } from '@mantine/core';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  const [players, setPlayers] = useState([]);
  const inputRef = useRef(null);

  const [playerInputValue, setPlayerInputValue] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const playerList = players.map(player => {
    return <Text style={{margin: 0}} key={player[0]}>{player[0]}</Text>
  });

  return (
    <MantineProvider defaultColorScheme='dark'>
      {!gameStarted && 
        <Flex gap="xl">
        <Flex pos="absolute" left="30%" top="20%" direction="column">
          <Text size="lg" fw="bolder" style={{margin: 0}}>Players: {players.length}</Text>
          {playerList}
        </Flex>
        <Flex pos="absolute" left="50%" top="40%" direction="column" gap="md">
          <Flex gap="sm">
            <TextInput ref={inputRef} autoFocus value={playerInputValue} onChange={(event) => setPlayerInputValue(event.currentTarget.value)} placeholder="Name" onKeyDown={(event) => {
              if (event.key === "Enter") {
                const currentPlayers = players;
                if (playerInputValue.length > 0) {
                  currentPlayers.push([playerInputValue, 50]);
                  setPlayers(currentPlayers);
                  setPlayerInputValue("");
                  inputRef.current.focus();
                }
              }
            }}></TextInput>
            <Button color="orange" onClick={() => {
              const currentPlayers = players;
              if (playerInputValue.length > 0) {
                currentPlayers.push([playerInputValue, 50]);
                setPlayers(currentPlayers);
                setPlayerInputValue("");
                inputRef.current.focus();
              }
            }}>Add</Button>
          </Flex>
          <Button color="orange" w={150} onClick={() => {setGameStarted(true)}}>Start Game</Button>
        </Flex>
      </Flex>
      } { gameStarted &&
        <div>
          <Tabs defaultValue="scores" color="orange">
            <div id="tabs">
              <Tabs.List>
                <Tabs.Tab value="scores">
                  Scores
                </Tabs.Tab>
                <Tabs.Tab value="round">
                  Round
                </Tabs.Tab>
              </Tabs.List>
            </div>
          
            <Tabs.Panel value="scores">
              {players.sort((a, b) => {
                  if (a[1] < b[1]) { return 1; } 
                  if (a[1] > b[1]) { return -1; }
                  return 0;
                }).map((player, index) => {
                    return(<Flex mb={3} pb={1} justify="space-between" key={player[0]} className="last-place" style={{borderBottom: "1px solid rgb(66,66,66)"}}>
                      <Text mr={5} w={25} pt={4} c="#d7642b">{index + 1}.</Text>
                      <Text fw="bold" mr={10} size="30px">{player[0]}</Text>
                      <Text  c="#d7642b" pt={5}>{player[1]}</Text>
                    </Flex>)
                })}
            </Tabs.Panel>

            <Tabs.Panel value="round">
              round tab content
            </Tabs.Panel>

          </Tabs>
        </div>
      }
    </MantineProvider>
  )
}

export default App
