import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Linking } from 'react-native';

const App = () => {
  // Estado para el tablero de juego
  const [board, setBoard] = useState(Array(9).fill(''));
  // Estado para el jugador actual
  const [player, setPlayer] = useState('X');
  // Estado para almacenar al ganador del juego
  const [winner, setWinner] = useState(null);
  // Estado para controlar la visibilidad del modal de finalización del juego
  const [showModal, setShowModal] = useState(false);
  // Estado para el tema oscuro
  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    // Verificar si hay un ganador después de cada movimiento
    const result = checkWinner();
    if (result) {
      setWinner(result);
      setShowModal(true);
    }
  }, [board]);

  // Función para verificar si hay un ganador
  const checkWinner = () => {
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

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes('')) {
      return 'draw';
    }

    return null;
  };

  // Manejar el evento de presionar un cuadro del tablero
  const handlePress = (index) => {
    if (board[index] || winner) {
      return;
    }

    const updatedBoard = [...board];
    updatedBoard[index] = player;
    setBoard(updatedBoard);
    setPlayer(player === 'X' ? 'O' : 'X');
  };

  // Reiniciar el juego
  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setPlayer('X');
    setWinner(null);
    setShowModal(false);
  };

  // Renderizar un cuadro del tablero
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

  // Renderizar el estado del juego (empate, ganador o turno del jugador)
  const renderStatus = () => {
    if (winner === 'draw') {
      return <Text style={[styles.status, darkTheme && styles.darkStatus]}>Empate</Text>;
    } else if (winner) {
      return <Text style={[styles.status, darkTheme && styles.darkStatus]}>Ganador: {winner}</Text>;
    } else {
      return <Text style={[styles.status, darkTheme && styles.darkStatus]}>Turno del jugador: {player}</Text>;
    }
  };

  // Alternar entre el tema claro y oscuro
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  // Abrir el enlace de descarga en el navegador
  const openDownloadLink = () => {
    Linking.openURL('https://drive.google.com/file/d/1nTKGKlyTLg6sF9i5fld35PhutQ0TnVqq/view?usp=sharing');
  };

  return (
    <View style={[styles.container, darkTheme && styles.darkContainer]}>
      <Text style={[styles.title, darkTheme && styles.darkTitle]}>3 En raya</Text>
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
        <View style={[styles.modalContainer, darkTheme && styles.darkModalContainer]}>
          <View style={[styles.modalContent, darkTheme && styles.darkModalContent]}>
            <Text style={[styles.modalText, darkTheme && styles.darkModalText]}>
              {winner === 'draw' ? 'Empate' : `Ganador: ${winner}`}
            </Text>
            <TouchableOpacity style={[styles.button, darkTheme && styles.darkButton]} onPress={resetGame}>
              <Text style={[styles.buttonText, darkTheme && styles.darkButtonText]}>Reiniciar juego</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.themeToggle}>
        <Text style={[styles.themeText, darkTheme && styles.darkThemeText]}>Tema oscuro:</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <View style={styles.toggleButton} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.downloadButton} onPress={openDownloadLink}>
        <Text style={styles.downloadButtonText}>Si quieres descargarlo, pulsa aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    marginBottom: 40,
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
    marginBottom: 20,
  },
  themeText: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  darkThemeText: {
    color: '#fff',
  },
  toggleButton: {
    width: 30,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  downloadButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  downloadButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default App;

