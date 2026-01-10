import './App.css'
import { useState } from 'react';
import { Button, Flex, TextInput } from '@mantine/core';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  const [players, setPlayers] = useState([]);
  const [playerInputValue, setPlayerInputValue] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const playerList = players.map(player => {
    return <p style={{margin: 0}} key={player[0]}>{player[0]}</p>
  });

  return (
    <MantineProvider defaultColorScheme='dark'>
      {!gameStarted && 
        <Flex gap="xl">
        <Flex direction="column">
          <h3 style={{margin: 0}}>Players: {players.length}</h3>
          {playerList}
        </Flex>
        <Flex direction="column" gap="md">
          <Flex gap="sm">
            <TextInput autoFocus value={playerInputValue} onChange={(event) => setPlayerInputValue(event.currentTarget.value)} placeholder="Name"></TextInput>
            <Button color="orange" onClick={() => {
              const currentPlayers = players;
              if (playerInputValue.length > 0) {
                currentPlayers.push([playerInputValue, 50]);
                setPlayers(currentPlayers);
                setPlayerInputValue("");
              }
            }}>Add</Button>
          </Flex>
          <Button color="orange" w={150} onClick={() => {setGameStarted(true)}}>Start Game</Button>
        </Flex>
      </Flex>
      }   
    </MantineProvider>
  )
}

export default App
