import React, { Component, cloneElement } from "react";
import Store from "./Store";

export default class State extends Component<{
    store: Store;
    parseState?: (state: any) => any;
    children?: React.ReactElement | ((state: any) => React.ReactElement);
}, any> {
    stateStore: Store
    subscription: string

    constructor(props) {
        super(props);

        this.stateStore = props.store;
        this.state = this.stateStore.state;
    }

    componentDidMount() {
        this.subscription = this.stateStore.subscribe(state =>
            this.setState(state)
        );
    }

    componentWillUnmount() {
        this.stateStore.unSubscribe(this.subscription);
    }

    render() {
        const state = this.props.parseState ?
            this.props.parseState(this.state) :
            this.state;

        if (!this.props.children) {
            throw new Error("Please add at least one child element.");
        }

        if (typeof this.props.children === "function") {
            return this.props.children(state);
        }

        if (Array.isArray(this.props.children)) {
            return this.props.children.map((child, index) =>
                cloneElement(child, state)
            );
        }

        if (typeof this.props.children === 'string' || typeof this.props.children === 'number' || typeof this.props.children === 'boolean') {
            return this.props.children
        }

        return cloneElement(this.props.children, state);
    }
}