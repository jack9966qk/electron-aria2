// entry point of the app when being webpacked

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import reducer, { initialState } from './reducer'
import RpcConnectionWithState from './containers/AriaConnectionWithState'

const store = createStore(reducer, initialState)

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <RpcConnectionWithState />
            </Provider>
        )
    }
}

ReactDOM.render( <App /> ,
    document.getElementById('content')
)

// for easier debug with shouldComponentUpdate
import * as d from 'shallow-diff'
window["diff"] = d