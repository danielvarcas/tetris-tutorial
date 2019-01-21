/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableHighlight, Symbol } from 'react-native';
import GameSceneAR from './js/GameSceneAR';

const API_KEY = "553DFB4E-F96E-4C5D-8546-5EA7ADB8483B";

const GAME_STATES = {
  MENU: Symbol("Menu"),
  IN_GAME: Symbol("InGame"),
  GAME_OVER: Symbol("GameOver"),
  LEVEL_START: Symbol("LevelStart"),
}


const SCORE_MODIFIER = 100;
const MODEL_PER_LEVEL = 10;

class ViroSample extends Component {

  state = {
    score: 0,
    level: 0,
    lives: 3,
    gameState: GAME_STATES.MENU
  }

  startGame = () => {
    this.setState({
      gameState: GAME_STATES.IN_GAME
    })
  }

  changeLevel = () => {
    this.setState({
      level: this.state.level + 1,
      gameState: GAME_STATES.LEVEL_START
    })
  }

  looseLive = () => {
    if (this.state.lives === 1) {
      return this.gameOver();
    }
    this.setState({
      lives: this.state.lives - 1
    })
  }

  gameOver = () => {
    this.setState({
      score: 0,
      level: 0,
      lives: 3,
      gameState: GAME_STATES.GAME_OVER
    })
  }

  backToMenu = () => {
    this.setState({
      score: 0,
      level: 1,
      live: 3,
      gameState: GAME_STATES.MENU
    })
  }

  updateScore = () => {
    this.setState({
      score: this.state.score + 100
    })
  }

  render() {
    switch (this.state.gameState) {
      case GAME_STATES.MENU:
        return this.renderUI()
      case GAME_STATES.IN_GAME:
        return this.renderGameView()
      case GAME_STATES.GAME_OVER:
        return this.renderUI()
      case GAME_STATES.LEVEL_START:
        return this.renderLevelStartGUI()
    }
  }

  renderUI() {
    return (
      <View style={localStyles.outer} >
        <View style={localStyles.inner} >
          <Text style={localStyles.titleText}>Pile Blocks AR</Text>
          <Text style={localStyles.titleText}>
            {this.state.gameState === GAME_STATES.MENU ? "MENU" : "GAME OVER"}
          </Text>
          {this.state.gameState === GAME_STATES.MENU &&
            <Text style={localStyles.text}>
              In this game you need to select a highlighted surface and pile blocks on it. When any of the blocks falls from the surface, you loose a life.
            </Text>
          }
          <TouchableHighlight style={localStyles.buttons}
            onPress={this.changeLevel}
            underlayColor={'#68a0ff'} >
            <Text style={localStyles.buttonText}>Start Game</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  renderLevelStartGUI() {
    return (
      <View style={localStyles.outer} >
        <View style={localStyles.inner}>
          <Text style={localStyles.titleText}>{`LEVEL ${this.state.level}`}</Text>
          <Text style={localStyles.text}>{`Put ${this.state.level * MODEL_PER_LEVEL} blocks on the surface. When you click on the block physics is applied. You can drag block around. Whenever block falls you loose a life`}</Text>
          <TouchableHighlight style={localStyles.buttons}
            onPress={this.startGame}
            underlayColor={'#68a0ff'} >
            <Text style={localStyles.buttonText}>Start Level</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  renderGameView() {
    return (
      <View style={localStyles.flex}>
        <StatusBar hidden={true} />
        <ViroARSceneNavigator
          apiKey={API_KEY}
          viroAppProps={{
            modelNumber: this.state.level * MODEL_PER_LEVEL,
            level: this.state.level,
            changeLevel: this.changeLevel,
            updateScore: this.updateScore,
            looseLive: this.looseLive,
            levelGUIRender: this.renderLevelStartGUI
          }}
          initialScene={{ scene: GameSceneAR }}
        />
        <View style={localStyles.topMenu}>
          <TouchableHighlight style={localStyles.buttons}
            underlayColor={'#68a0ff'}
            onPress={this.backToMenu}
          >
            <Text style={localStyles.buttonText}>
              Back
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={localStyles.buttons}
            underlayColor={'#68a0ff'} >
            <Text style={localStyles.buttonText}>
              {this.state.score}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={localStyles.buttons}
            active={!this.state.modelLoading}
            underlayColor={'#68a0ff'}>
            <Text style={localStyles.buttonText}>
              {`Lives: ${this.state.lives}`}
            </Text>
          </TouchableHighlight>
        </View>
      </View >
    )
  }
}

App.propTypes = {

};

export default ViroSample;