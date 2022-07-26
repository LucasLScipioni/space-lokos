import Main from './main';
import { useEffect, useState } from 'react';
import 'phaser';

export default function Index() {
  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    if (typeof window !== 'object') {
      return;
    }

    const gameScene = new Phaser.Scene('Game');

    const config = {
      type: Phaser.AUTO,
      width: 720,
      height: 1280,
      parent: 'game-div',
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: { y: 200 }
        }
      },
    }
    let game = new Phaser.Game(config);

    game.scene.add('game', Main);
    game.scene.start('game');
  };

  return null;
}