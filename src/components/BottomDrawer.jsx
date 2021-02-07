import React from 'react';
import styled from 'styled-components';

import Icon from '@mdi/react';
import { mdiArrowCollapseDown } from '@mdi/js';

import * as Colors from '../colors';


const STYLE = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',

};

const TabBar = styled.div`
    display: flex;
    flex-direction: row;
    text-align: left;
    background-color: ${Colors.bgDarker};
    cursor: row-resize;
    border-bottom: 1px solid ${Colors.bgLight};
`;

const InactiveTab = styled.span`
    padding: 4px 8px;
    background-color: ${Colors.bgDark};
    color: ${Colors.fgPrimary};
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    font-size: 10pt;
    font-weight: 400;
    border-right: 1px solid ${Colors.bgLight};
    cursor: pointer;
    user-select: none;
    :hover {
        background-color: ${Colors.bgLight};
    }
`;

const ActiveTab = styled(InactiveTab)`
    backgroundColor: ${Colors.bgDarker};
    color: ${Colors.fgSecondary};
`;

const CONTENT_STYLE = {
    overflowY: 'scroll',
};

export class BottomDrawer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            maxHeight: 500,
        };

        this.isResizable = this.isResizable.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    onTabClick(event, tabIndex) {
        const activeTab = tabIndex == this.state.activeTab
              ? -1
              : tabIndex;

        this.setState({
            ...this.state,
            activeTab: activeTab
        });
    }

    isResizable() {
        const t = this.state.activeTab;
        return t !== -1 && this.props.children[t].resizable;
    }

    onMouseDown(event) {
        if (event.target !== event.currentTarget) return;

        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onDrag(event) {
        this.setState({
            ...this.state,
            maxHeight: this.state.maxHeight - event.movementY,
        });
    }

    onMouseUp() {
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    render() {
        const children = this.props.children.flat();
        return <div style={STYLE}>
                 <TabBar onMouseDown={this.onMouseDown}>
                   {
                       children
                           .filter(child => child && child.type === BottomDrawerTab)
                           .map((child, i) => {
                               const Tab = i == this.state.activeTab
                                     ? ActiveTab
                                     : InactiveTab;
                               return <Tab onClick={e => this.onTabClick(e, i)}
                                           key={i}>
                                        {child.props.name}
                                      </Tab>;
                       })
                   }
                 </TabBar>
                 <div style={{...CONTENT_STYLE, 'maxHeight': this.state.maxHeight}}>
                   {
                       this.state.activeTab === -1 ||
                           children[this.state.activeTab]
                   }
                 </div>
               </div>;
    }
}


export class BottomDrawerTab extends React.Component {
    render() {
        return <div>
                 {
                     this.props.children
                 }
               </div>;
    }
}
