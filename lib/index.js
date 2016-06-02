const React = require('react');
const ReactDOM = require('react-dom');
const grudgeBin = require('./data-store');

class GrudgeBin extends React.Component {
  constructor() {
    super();
    this.state = {
      grudges: grudgeBin.all(),
    };
  };

  componentDidMount() {
    grudgeBin.on('change', grudges => {
      this.setState({ grudges })
    });
  }

  render() {
    return (
      <div className='grudgeBin'>
        <header className='myGrudges'>
          <h1>{ this.props.title }</h1>
          <GrudgeCounter />
          <CreateGrudge />
          <GrudgeList grudges={ this.state.grudges }/>
        </header>
      </div>
    );
  };
};

class CreateGrudge extends React.Component {
  constructor() {
    super();
    this.state = {
      person: '',
      grudge: '',
    }
  }

  updateProperties(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  createGrudge(e) {
    e.preventDefault();
    grudgeBin.create(this.state);
    this.setState({ person: '',
                  grudge: '',
    });
  }

  render() {
    return (
      <div className='createGrudge'>
        <input className='createGrudge-person'
          name='person'
          placeholder='persons name'
          value={this.state.person}
          onChange={(e) => this.updateProperties(e)} />
        <textarea className='createGrudge-body'
          name='grudge'
          placeholder='what they did?'
          value={this.state.grudge}
          onChange={(e) => this.updateProperties(e)} />
        <input className='createGrudge-btn'
          name='submit'
          type='submit'
          onClick={(e) => this.createGrudge(e)} />
      </div>
    )
  }
}

const GrudgeList = (props) => {
  const grudges = props.grudges;
  return(
    <div className='grudge-list'>
      {grudges.map(grudge => <GrudgeListItem {...grudge} key={grudge.id}/>)}
    </div>
  );
}

const GrudgeListItem = ({id, person, grudge, forgiven}) => {
  var status = forgiven ? 'Forgiven!' :
    <button onClick={() => grudgeBin.forgive(id)}>Forgive</button>

    return (
      <div>
        <h3>{person}</h3>
        <div>{grudge}</div>
        {status}
      </div>
    )
}

const GrudgeCounter = () => {
  var grudgeCount = grudgeBin.all().length;
  var forgivenGrudges = grudgeBin.forgiven().length;
  var unforgivenGrudges = grudgeBin.unforgiven().length;

  return(
    <div>
      <h3>Total Grudges: {grudgeCount}</h3>
      <h3>Total Forgiven: {forgivenGrudges}</h3>
      <h3>Total Unforgiven: {unforgivenGrudges}</h3>
    </div>
  );
}

ReactDOM.render(<GrudgeBin title='Grudge Bin' />, document.querySelector('.application'));
