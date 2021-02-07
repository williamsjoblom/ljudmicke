import React from 'react';
import Icon from '@mdi/react';
import { mdiArrowCollapseDown } from '@mdi/js';

import * as Colors from '../colors';

const STYLE = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',

};

const TAB_BAR_STYLE = {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
    backgroundColor: Colors.bgDarker,
    cursor: 'row-resize',
    borderBottom: '1px solid' + Colors.bgLight
};

const TAB_STYLE = {
    padding: '4px 8px',
    backgroundColor: Colors.bgDark,
    color: Colors.fgPrimary,
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: '10pt',
    fontWeight: '400',
    borderRight: '1px solid ' + Colors.bgLight,
    cursor: 'pointer',
};

const TAB_ACTIVE = {
    backgroundColor: Colors.bgDarker,
    color: Colors.fgSecondary,
};

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
        const TAB_ACTIVE_STYLE = {
            ...TAB_STYLE,
            ...TAB_ACTIVE,
        };

        return <div style={STYLE}>
                 <div style={TAB_BAR_STYLE}
                      onMouseDown={this.onMouseDown}>
                   {
                       this.props.children.map(
                           (child, i) => <span style={(i === this.state.activeTab) ? TAB_ACTIVE_STYLE : TAB_STYLE}
                                               onClick={e => this.onTabClick(e, i)}
                                               key={i}>
                                           {/* <Icon size={0.75} */}
                                           {/*       color={Colors.fgSecondary} */}
                                           {/*       path={child.props.icon}/> */}
                                           {child.props.name}
                                         </span>
                       )
                   }
                   {/* <div style={{marginLeft: 'auto', */}
                   {/*              marginTop: 'auto', */}
                   {/*              marginBottom: 'auto'}}> */}

                   {/* </div> */}
                 </div>
                 <div style={{...CONTENT_STYLE, 'maxHeight': this.state.maxHeight}}>
                   {
                       this.state.activeTab === -1 ||
                           this.props.children[this.state.activeTab]
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
