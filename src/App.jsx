import './App.css'
import { useState, useRef } from 'react';
import { Button, Flex, Text, TextInput, Tabs, NumberInput } from '@mantine/core';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  const [players, setPlayers] = useState([]);
  const inputRef = useRef(null);

  const [playerInputValue, setPlayerInputValue] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const playerList = players.map(player => {
    return <Text style={{margin: 0}} key={player.name}>{player.name}</Text>
  });

  const sortedPlayers = [...players].sort(
    (a, b) => b.score - a.score
  );

  const wagerSortedPlayers = [...players].sort(
    (a, b) => b.wager - a.wager
  );

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
                if (playerInputValue.length > 0) {
                  setPlayers(players => [
                    ...players,
                    {
                      name: playerInputValue,
                      score: 50,
                      wager: 0
                    }
                  ]);
                  setPlayerInputValue("");
                  inputRef.current.focus();
                }
              }
            }}></TextInput>
            <Button color="orange" onClick={() => {
              if (playerInputValue.length > 0) {
                setPlayers(players => [
                    ...players,
                    {
                      name: playerInputValue,
                      score: 50,
                      wager: 0
                    }
                ]);
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
                <Tabs.Tab value="wagers">
                  Wagers
                </Tabs.Tab>
                <Tabs.Tab value="game">
                  Game
                </Tabs.Tab>
              </Tabs.List>
            </div>
          
            <Tabs.Panel value="scores">
              {sortedPlayers.map((player, index) => {
                    return(
                    <Flex mb={3} pb={1} justify="space-between" key={player.name} style={{borderBottom: "1px solid rgb(66,66,66)"}}>
                      <Text mr={5} w={25} pt={4} c="#d7642b">{index + 1}.</Text>
                      <Text fw="bold" mr={10} size="30px">{player.name}</Text>
                      <NumberInput
                        c="#d7642b"
                        hideControls
                        w={55}
                        mb={1}
                        value={player.score}
                        onChange={(value) => {
                          setPlayers(players =>
                            players.map(p => p.name === player.name ? { ...p, score: value } : p)
                          );
                        }}
                      />
                    </Flex>)
                })}
            </Tabs.Panel>

            <Tabs.Panel value="wagers">
              {[...players].map((player) => {
                    return(
                    <Flex mb={3} pb={1} justify="space-between" key={player.name} style={{borderBottom: "1px solid rgb(66,66,66)"}}>
                      <Text fw="bold" mr={10} size="30px">{player.name}</Text>
                      <Flex>
                        <Text mr={5} w={25} pt={4} c="#d7642b">{player.score}</Text>
                        <NumberInput
                        c="#d7642b"
                        hideControls
                        w={55}
                        mb={1}
                        value={player.wager}
                        onChange={(value) => {
                          setPlayers(players =>
                            players.map(p => p.name === player.name ? { ...p, wager: value } : p)
                          );
                        }}
                      />
                      </Flex>
                      
                    </Flex>)
                })
                }
            </Tabs.Panel>

            <Tabs.Panel value="game">
              <Flex>
                <Flex direction="column">
                  {wagerSortedPlayers.map((player, index) => {
                    return(
                    <Flex mb={3} pb={1} justify="space-between" key={player.name} style={{borderBottom: "1px solid rgb(66,66,66)"}}>
                      <Text mr={5} w={25} pt={4} c="#d7642b">{index + 1}.</Text>
                      <Text fw="bold" mr={10} size="30px">{player.name}</Text>
                      <Text mr={5} w={25} pt={4} c="#d7642b">{player.score}</Text>
                      <Text mr={5} w={25} pt={4} c="#d7642b">{player.wager}</Text>
                    </Flex>)
                    })
                  }
                </Flex>

              </Flex>
            </Tabs.Panel>

          </Tabs>
        </div>
      }
    </MantineProvider>
  )
}

export default App
