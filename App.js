import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Switch,
} from 'react-native';

const App = () => {
  // Estado para mantener el tablero del juego
  const [board, setBoard] = useState(Array(9).fill(''));

  // Estado para mantener el jugador actual (X o O)
  const [player, setPlayer] = useState('X');

  // Estado para mantener al ganador del juego o 'draw' si hay empate
  const [winner, setWinner] = useState(null);

  // Estado para controlar si el modal que muestra el resultado está visible
  const [showModal, setShowModal] = useState(false);

  // Estado para controlar el tema (oscuro o claro)
  const [darkTheme, setDarkTheme] = useState(true);

  // Efecto para comprobar si hay un ganador o empate en el tablero después de cada movimiento
  useEffect(() => {
    const result = checkWinner();
    if (result) {
      setWinner(result);
      setShowModal(true);
    }
  }, [board]);

  // Función para comprobar si hay un ganador o empate en el tablero
  const checkWinner = () => {
    // Combinaciones ganadoras en el tablero
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    // Comprueba todas las combinaciones para ver si hay un ganador
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Devuelve 'X' o 'O' como ganador
      }
    }

    // Si el tablero no tiene más movimientos disponibles, hay un empate
    if (!board.includes('')) {
      return 'draw';
    }

    return null; // Si no hay ganador ni empate, devuelve null
  };

  // Función para manejar el evento de presionar un cuadrado en el tablero
  const handlePress = (index) => {
    if (board[index] || winner) {
      return; // No se hace nada si el cuadrado ya está ocupado o ya hay un ganador
    }

    const updatedBoard = [...board];
    updatedBoard[index] = player; // Actualiza el tablero con el símbolo del jugador actual (X o O)
    setBoard(updatedBoard);
    setPlayer(player === 'X' ? 'O' : 'X'); // Cambia al siguiente jugador (alternando entre X y O)
  };

  // Función para reiniciar el juego
  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setPlayer('X');
    setWinner(null);
    setShowModal(false); // Oculta el modal con el resultado
  };

  // Función para renderizar un cuadrado en el tablero
  const renderSquare = (index) => {
    return (
      <TouchableOpacity
        style={[styles.square, darkTheme && styles.darkSquare]}
        onPress={() => handlePress(index)}
      >
        <Text style={[styles.squareText, darkTheme && styles.darkSquareText]}>
          {board[index]}
        </Text>
      </TouchableOpacity>
    );
  };

  // Función para renderizar el estado del juego (turno, ganador o empate)
  const renderStatus = () => {
    if (winner === 'draw') {
      return <Text style={[styles.status, darkTheme && styles.darkStatus]}>Empate</Text>;
    } else if (winner) {
      return <Text style={[styles.status, darkTheme && styles.darkStatus]}>Ganador: {winner}</Text>;
    } else {
      return <Text style={[styles.status, darkTheme && styles.darkStatus]}>Turno del jugador: {player}</Text>;
    }
  };

  // Función para alternar entre el tema oscuro y claro
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <View style={[styles.container, darkTheme && styles.darkContainer]}>
      <Text style={[styles.title, darkTheme && styles.darkTitle]}>Triqui X O</Text>
      <View style={styles.board}>
        <View style={styles.row}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </View>
        <View style={styles.row}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </View>
        <View style={styles.row}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </View>
      </View>
      {renderStatus()}
      <Modal visible={showModal} animationType="slide" transparent>
        <View
          style={[
            styles.modalContainer,
            darkTheme && styles.darkModalContainer,
          ]}
        >
          <View style={[styles.modalContent, darkTheme && styles.darkModalContent]}>
            <Text style={[styles.modalText, darkTheme && styles.darkModalText]}>
              {winner === 'draw' ? 'Empate' : `Ganador: ${winner}`}
            </Text>
            <TouchableOpacity
              style={[
                styles.button,
                darkTheme && styles.darkButton,
              ]}
              onPress={resetGame}
            >
              <Text style={[styles.buttonText, darkTheme && styles.darkButtonText]}>
                Reiniciar juego
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.themeToggle}>
        <Text style={[styles.themeText, darkTheme && styles.darkThemeText]}>Tema oscuro</Text>
        <Switch value={darkTheme} onValueChange={toggleTheme} />
      </View>
    </View>
  );
};

// Estilos para los componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  darkTitle: {
    color: '#fff',
  },
  board: {
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  darkSquare: {
    backgroundColor: '#333',
    borderColor: '#fff',
  },
  squareText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  darkSquareText: {
    color: '#fff',
  },
  status: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  darkStatus: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  darkModalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 40,
    alignItems: 'center',
    borderRadius: 10,
  },
  darkModalContent: {
    backgroundColor: '#333',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  darkModalText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  darkButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  darkButtonText: {
    color: '#333',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  themeText: {
    fontSize: 16,
    marginRight: 10,
  },
  darkThemeText: {
    color: '#fff',
  },
});

export default App;
