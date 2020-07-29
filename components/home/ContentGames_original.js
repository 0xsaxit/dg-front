import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Grid, Icon, Table } from 'semantic-ui-react';
import Spinner from '../Spinner';

let Global;
let totalRecords;

const INITIAL_STATE = {
  data: [],
  slotPlay: [],
  slotMana: [],
  slotDai: [],
  roulettePlay: [],
  rouletteMana: [],
  rouletteDai: [],
  backgammonPlay: [],
  backgammonMana: [],
  backgammonDai: [],
  timePeriod: 'ALL TIME',
  isLoading: true,
};

class ContentGames extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    Global = require('../Constants').default;
    let object = this;
    window.ethereum.on('accountsChanged', async function (accounts) {
      await object.getUserData();
    });
    await this.getTotalRecords();
    await this.getUserData(this.props.timePeriod);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.timePeriod !== this.state.timePeriod) {
      this.setState({ timePeriod: this.props.timePeriod });
      await this.getUserData(this.props.timePeriod);
    }
  }

  async getTotalRecords() {
    const response = await this.getData();
    totalRecords = await response.json();
    this.setState({ isLoading: false });
  }

  async getUserData(timePeriod) {
    let json;

    if (timePeriod === 'ALL TIME') {
      json = totalRecords.all;
    } else if (timePeriod === 'WEEK') {
      json = totalRecords.weekly;
    } else {
      json = totalRecords.daily;
    }

    console.log('3', timePeriod, json);

    if (json !== undefined) {
      // get play data
      let slotPlay = [];
      json.slot.play.map((row) => {
        slotPlay.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      let roulettePlay = [];
      json.roulette.play.map((row) => {
        roulettePlay.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      let backgammonPlay = [];
      json.backgammon.play.map((row) => {
        backgammonPlay.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      // get mana data
      let slotMana = [];
      json.slot.mana.map((row) => {
        slotMana.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      let rouletteMana = [];
      json.roulette.mana.map((row) => {
        rouletteMana.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      let backgammonMana = [];
      json.backgammon.mana.map((row) => {
        backgammonMana.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      // get dai data
      let slotDai = [];
      json.slot.dai.map((row) => {
        slotDai.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      let rouletteDai = [];
      json.roulette.dai.map((row) => {
        rouletteDai.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      let backgammonDai = [];
      json.backgammon.dai.map((row) => {
        backgammonDai.push({
          name: row.name,
          address: row.address,
          winnings: row.winnings,
        });
      });

      this.setState({
        slotPlay: slotPlay,
        slotMana: slotMana,
        slotDai: slotDai,
        roulettePlay: roulettePlay,
        rouletteMana: rouletteMana,
        rouletteDai: rouletteDai,
        backgammonPlay: backgammonPlay,
        backgammonMana: backgammonMana,
        backgammonDai: backgammonDai,
      });
    }
  }

  getData = () => {
    return fetch(`${Global.API_BASE_URL}/admin/getTotalRecords`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  };

  render() {
    const {
      slotPlay,
      slotMana,
      slotDai,
      roulettePlay,
      rouletteMana,
      rouletteDai,
      backgammonPlay,
      backgammonMana,
      backgammonDai,
    } = this.state;

    if (this.state.isLoading === true) {
      return <Spinner background={0} />;
    } else {
      return (
        <div>
          <Grid>
            <Grid.Column computer={4}>
              <Table id="header" singleLine fixed>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="table-header-text">
                      SLOTS
                    </Table.HeaderCell>
                    <Table.HeaderCell className="table-header-text">
                      WIN
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {this.props.gameSelect === 'play' ? (
                  <Table.Body>
                    {slotPlay.map((row, index) => {
                      var amount = parseInt(
                        Number(row.winnings) / Global.FACTOR
                      );
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>
                            {row.name === null || row.name === ''
                              ? row.address.substr(0, 6) +
                                '...' +
                                row.address.substr(-4)
                              : row.name}
                          </Table.Cell>
                          <Table.Cell>{amount}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                ) : this.props.gameSelect === 'mana' ? (
                  <Table.Body>
                    {slotMana.map((row, index) => {
                      var amount = parseInt(
                        Number(row.winnings) / Global.FACTOR
                      );
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>
                            {row.name === null || row.name === ''
                              ? row.address.substr(0, 6) +
                                '...' +
                                row.address.substr(-4)
                              : row.name}
                          </Table.Cell>
                          <Table.Cell>{amount}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                ) : (
                  <Table.Body>
                    {slotDai.map((row, index) => {
                      var amount = parseInt(
                        Number(row.winnings) / Global.FACTOR
                      );
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>
                            {row.name === null || row.name === ''
                              ? row.address.substr(0, 6) +
                                '...' +
                                row.address.substr(-4)
                              : row.name}
                          </Table.Cell>
                          <Table.Cell>{amount}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                )}
              </Table>
            </Grid.Column>

            <Grid.Column computer={4}>
              <Table id="header" singleLine fixed>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="table-header-text">
                      ROULETTE
                    </Table.HeaderCell>
                    <Table.HeaderCell className="table-header-text">
                      WIN
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {this.props.gameSelect === 'play' ? (
                  <Table.Body>
                    {roulettePlay.map((row, index) => {
                      var amount = parseInt(
                        Number(row.winnings) / Global.FACTOR
                      );
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>
                            {row.name === null || row.name === ''
                              ? row.address.substr(0, 6) +
                                '...' +
                                row.address.substr(-4)
                              : row.name}
                          </Table.Cell>
                          <Table.Cell>{amount}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                ) : this.props.gameSelect === 'mana' ? (
                  <Table.Body>
                    {rouletteMana.map((row, index) => {
                      var amount = parseInt(
                        Number(row.winnings) / Global.FACTOR
                      );
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>
                            {row.name === null || row.name === ''
                              ? row.address.substr(0, 6) +
                                '...' +
                                row.address.substr(-4)
                              : row.name}
                          </Table.Cell>
                          <Table.Cell>{amount}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                ) : (
                  <Table.Body>
                    {rouletteDai.map((row, index) => {
                      var amount = parseInt(
                        Number(row.winnings) / Global.FACTOR
                      );
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>
                            {row.name === null || row.name === ''
                              ? row.address.substr(0, 6) +
                                '...' +
                                row.address.substr(-4)
                              : row.name}
                          </Table.Cell>
                          <Table.Cell>{amount}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                )}
              </Table>
            </Grid.Column>

            <Grid.Column computer={4}>
              <Table id="header" singleLine fixed>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="table-header-text">
                      BLACKJACK
                    </Table.HeaderCell>
                    <Table.HeaderCell className="table-header-text">
                      WIN
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
              </Table>
            </Grid.Column>

            <Grid.Column computer={4}>
              <Table id="header" singleLine fixed>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="table-header-text">
                      BACKGAMMON
                    </Table.HeaderCell>
                    <Table.HeaderCell className="table-header-text">
                      WIN
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {this.props.gameSelect === 'play' ? (
                  <Table.Body>
                    {backgammonPlay.map((row, index) => {
                      var amount = parseInt(
                        Number(row.winnings) / Global.FACTOR
                      );
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>
                            {row.name === null || row.name === ''
                              ? row.address.substr(0, 6) +
                                '...' +
                                row.address.substr(-4)
                              : row.name}
                          </Table.Cell>
                          <Table.Cell>{amount}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                ) : this.props.gameSelect === 'mana' ? (
                  <Table.Body>
                    {backgammonMana.map((row, index) => {
                      var amount = parseInt(
                        Number(row.winnings) / Global.FACTOR
                      );
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>
                            {row.name === null || row.name === ''
                              ? row.address.substr(0, 6) +
                                '...' +
                                row.address.substr(-4)
                              : row.name}
                          </Table.Cell>
                          <Table.Cell>{amount}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                ) : (
                  <Table.Body>
                    {backgammonDai.map((row, index) => {
                      var amount = parseInt(
                        Number(row.winnings) / Global.FACTOR
                      );
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>
                            {row.name === null || row.name === ''
                              ? row.address.substr(0, 6) +
                                '...' +
                                row.address.substr(-4)
                              : row.name}
                          </Table.Cell>
                          <Table.Cell>{amount}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                )}
              </Table>
            </Grid.Column>
          </Grid>
        </div>
      );
    }
  }
}

export default ContentGames;
