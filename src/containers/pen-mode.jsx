import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../modes/modes';

import {changeMode} from '../reducers/modes';
import {clearSelectedItems} from '../reducers/selected-items';

import {clearSelection} from '../helper/selection';
import PenTool from '../helper/tools/pen-tool';
import PenModeComponent from '../components/pen-mode/pen-mode.jsx';

class PenMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isPenModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool &&
                (nextProps.colorState.strokeColor !== this.props.colorState.strokeColor ||
                nextProps.colorState.strokeWidth !== this.props.colorState.strokeWidth)) {
            this.tool.setColorState(nextProps.colorState);
        }

        if (nextProps.isPenModeActive && !this.props.isPenModeActive) {
            this.activateTool();
        } else if (!nextProps.isPenModeActive && this.props.isPenModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isPenModeActive !== this.props.isPenModeActive;
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        this.tool = new PenTool(
            this.props.clearSelectedItems,
            this.props.onUpdateSvg
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <PenModeComponent
                isSelected={this.props.isPenModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

PenMode.propTypes = {
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: PropTypes.string,
        strokeColor: PropTypes.string,
        strokeWidth: PropTypes.number
    }).isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isPenModeActive: PropTypes.bool.isRequired,
    onUpdateSvg: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    isPenModeActive: state.scratchPaint.mode === Modes.PEN

});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.PEN));
    },
    deactivateTool () {
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PenMode);
