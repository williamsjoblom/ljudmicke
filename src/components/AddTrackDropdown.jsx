import React from 'react';
import Icon from '@mdi/react';
import { mdiPiano,
         mdiWaveform,
         mdiRobotExcitedOutline} from '@mdi/js';

import * as Colors from '../colors';

const STYLE = {
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: Colors.bgDarker,
    color: Colors.fgPrimary,
    fontWeight: 500,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    textAlign: 'left',
    border: `1px solid ${Colors.bgLighter}`,
    borderLeft: '0px',
};

const ITEM_STYLE = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '4px 8px',
    cursor: 'pointer',
    borderTop: `1px solid ${Colors.bgLight}`
    // height: '40px',
};

const DESC_STYLE = {
    display: 'block',
    fontSize: '9pt',
    fontWeight: 400,
    color: Colors.fgTernary
};

const INPUT_STYLE = {
    padding: '4px 0',
    margin: 0,
    border: 0,
    outline: 'none',
    width: '100%',
    fontFamily: 'Roboto Mono',
    textAlign: 'center',
    backgroundColor: Colors.bgDarker,
    color: Colors.fgSecondary,
};

class AddTrackDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    componentDidMount() {
        this.inputRef.current.focus();
    }

    render() {
        const items = [
            {
                type: 'audio',
                title: 'Audio Track',
                subtitle: 'Audio clips',
                icon: mdiWaveform
            },
            {
                type: 'midi',
                title: 'MIDI Track',
                subtitle: 'MIDI instrument patterns',
                icon: mdiPiano
            },
            {
                type: 'automation',
                title: 'Automation Track',
                subtitle: 'Automation clips',
                icon: mdiRobotExcitedOutline,
            }
        ];

        return <div style={STYLE}>
                 <div>
                   <input type="text"
                          placeholder="Track name"
                          ref={this.inputRef}
                          style={INPUT_STYLE}>
                   </input>
                 </div>
                 {
                     items.map((item, i) =>
                         <div style={ITEM_STYLE}
                              key={i}
                              onClick={() => this.props.onAdd(item.type,
                                                              this.inputRef.current.value)}>
                           <Icon path={item.icon}
                                 color={Colors.fgSecondary}
                                 size={1}/>
                           <div style={{marginLeft: '8px'}}>
                             {item.title}
                             <span style={DESC_STYLE}>{item.subtitle}</span>
                           </div>
                         </div>
                     )
                 }
               </div>;
    }
}

export default AddTrackDropdown;
