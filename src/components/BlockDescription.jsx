import React, { Component } from 'react'

export class BlockDescription extends Component {

    state = {
        description: ''
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.addDescription(this.state.description, this.props.time);
        this.setState({
            description: ''
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render() {
        return (
            <form onSubmit={this.onSubmit} style={{ display: 'flex' }}>
                <input
                    type="text"
                    name="description"
                    style={{ flex: 5, padding: '5px' }}
                    placeholder="Descript sth ..."
                    value={this.state.description}
                    onChange={this.onChange}
                />
                <input
                    type="submit"
                    value="comment"
                    className="btn"
                    style={{ flex: 1 }} />
            </form>
        )
    }
}
export default BlockDescription