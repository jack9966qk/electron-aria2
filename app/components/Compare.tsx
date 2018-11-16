import * as React from 'react'
import * as isEqual from 'react-fast-compare'

export const compare = (Component) => {
    class Compared extends React.Component<any, any> {
        shouldComponentUpdate(nextProps) {
            return !isEqual(this.props, nextProps)
        }

        render() {
            return <Component {...this.props} />
        }
    }

    return Compared
}