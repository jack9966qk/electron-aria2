import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import reducer, { initialState } from './reducer'
import ControlWithState from './containers/controlWithState'

const store = createStore(reducer, initialState)

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <ControlWithState />
            </Provider>
        )
    }
}

ReactDOM.render( <App /> ,
    document.getElementById('content')
)