import './App.css'
import { useState, useRef } from 'react';
import { Button, Flex, Text, TextInput, Tabs, NumberInput, Select } from '@mantine/core';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  const [players, setPlayers] = useState([]);
  const inputRef = useRef(null);

  const [playerInputValue, setPlayerInputValue] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [numPlayers, setNumPlayers] = useState(0);
  const [firstPlace, setFirstPlace] = useState(null)
  const [secondPlace, setSecondPlace] = useState(null);
  const [thirdPlace, setThirdPlace] = useState(null);

  const playerList = players.map(player => {
    return <Text style={{margin: 0}} key={player.name}>{player.name}</Text>
  });

  const sortedPlayers = [...players].sort(
    (a, b) => b.score - a.score
  );

  const wagerSortedPlayers = [...players].sort(
    (a, b) => b.wager - a.wager
  );

  const qualifiedPlayers = wagerSortedPlayers.slice(0, numPlayers);
  const totalWager = qualifiedPlayers.reduce((s, p) => s + (p.wager ?? 0), 0);

  const qualifiedPlayerNames = wagerSortedPlayers
  .slice(0, numPlayers ?? 0)
  .map(player => player.name);

  const payouts = {
    first: totalWager * 0.6,
    second: totalWager * 0.3,
    third: totalWager * 0.1,
  };

  const truncate2 = (num) =>
   Math.trunc((num ?? 0) * 100) / 100;

 const endGame = () => {
  setPlayers(players =>
    players.map(player => {
      let scoreChange = 0;

      // 1️⃣ payouts
      if (player.name === firstPlace) {
        scoreChange += payouts.first;
      } else if (player.name === secondPlace) {
        scoreChange += payouts.second;
      } else if (player.name === thirdPlace) {
        scoreChange += payouts.third;
      }
      // 2️⃣ qualified but not top 3 → lose wager
      else if (qualifiedPlayerNames.includes(player.name)) {
        scoreChange -= player.wager;
      }

      return {
        ...player,
        score: player.score + scoreChange,
        wager: 0, // 4️⃣ reset wagers
      };
    })
  );

    //cleanup
    setFirstPlace(null);
    setSecondPlace(null);
    setThirdPlace(null);
  };

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
                        value={truncate2(player.score)}
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
                        <Text mr={5} w={25} pt={4} c="#d7642b">{truncate2(player.score)}</Text>
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
              <Flex gap={300}>
                <Flex direction="column">
                  <Text>Players sorted by wager</Text>
                  {wagerSortedPlayers.map((player, index) => {
                    return(
                    <Flex mb={3} pb={1} justify="space-between" key={player.name} style={{borderBottom: "1px solid rgb(66,66,66)"}}>
                      <Text mr={5} w={25} pt={4} c="#d7642b">{index + 1}.</Text>
                      <Text fw="bold" mr={10} size="30px" c={index < numPlayers ? "white" : "red"}>{player.name}</Text>
                      <Flex gap="md">
                        <Text mr={5} w={25} pt={4} c="#d7642b">{truncate2(player.score)}</Text>
                        <Text mr={5} w={25} pt={4} c="white">{player.wager}</Text>
                      </Flex>
                    </Flex>)
                    })
                  }
                </Flex>
                <Flex direction="column">
                  <NumberInput hideControls
                    value={numPlayers}
                    label="# of players in next game"
                    onChange={(value) => { setNumPlayers(value)}}
                  />
                  <Flex gap="sm">
                    <Text>Total wager pool for {numPlayers} players</Text>
                    <Text fw="bold">{totalWager}</Text>
                  </Flex>
                  <Flex direction="column" mt={20}>
                    <Select
                      ta="left" 
                      label="First place"
                      value={firstPlace}
                      onChange={setFirstPlace}
                      placeholder="Pick a player"
                      searchable
                      data={players.map(player => player.name)}
                    />
                    <Select
                      ta="left"
                      label="Second place"
                      value={secondPlace}
                      onChange={setSecondPlace}
                      placeholder="Pick a player"
                      searchable
                      data={players.map(player => player.name)}
                    />
                    <Select
                      ta="left"
                      label="Third place"
                      value={thirdPlace}
                      onChange={setThirdPlace}
                      placeholder="Pick a player"
                      searchable
                      data={players.map(player => player.name)}
                    />
                  </Flex>
                  <Button
                    mt="md"
                    color="orange"
                    disabled={!firstPlace || !secondPlace || !thirdPlace}
                    onClick={endGame}
                  >
                    Update scores and reset wagers
                  </Button>
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
