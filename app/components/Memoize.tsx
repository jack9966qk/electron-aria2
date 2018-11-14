import * as React from 'react'
import * as isEqual from 'react-fast-compare'

export const memoize = (Component) => {
    class Memoized extends React.Component<any, any> {
        shouldComponentUpdate(nextProps) {
            return !isEqual(this.props, nextProps)
        }

        render() {
            return <Component {...this.props} />
        }
    }

    return Memoized
}