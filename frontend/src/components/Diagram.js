/*! JointJS+ v3.5.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2022 client IO

 2022-07-22 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import React, { Component } from 'react';
import { setTheme } from '@clientio/rappid';

import { StencilService } from './Diagram/services/stencil-service';
import { ToolbarService } from './Diagram/services/toolbar-service';
import { InspectorService } from './Diagram/services/inspector-service';
import { HaloService } from './Diagram/services/halo-service';
import { KeyboardService } from './Diagram/services/keyboard-service';
import RappidService from './Diagram/services/kitchen-sink-service';

import { ThemePicker } from './Diagram/views/theme-picker';
import { sampleGraphs } from './Diagram/config/sample-graphs';

import './Diagram/css/style.css';
import './Diagram/css/theme-picker.css';

class Diagram extends Component {

    constructor(props) {
        super(props);
        this.appRef = React.createRef();
        this.themePickerRef = React.createRef();
    }

    componentDidMount() {

        setTheme('modern');

        const service = new RappidService(
            this.appRef.current,
            new StencilService(),
            new ToolbarService(),
            new InspectorService(),
            new HaloService(),
            new KeyboardService()
        );
        this.rappid = service;
        service.startRappid();
        service.graph.fromJSON(JSON.parse(sampleGraphs.emergencyProcedure));

        const themePicker = new ThemePicker({
            el: this.themePickerRef.current,
            mainView: service
        });
        themePicker.render();
        this.themePicker = themePicker;
    }

    componentWillUnmount() {
        this.rappid.stopRappid();
        this.themePicker.remove();
    }

    render() {
        return (
            <div ref={this.appRef} className="Diagram">
                <div className="app-header">
                    <div className="app-title">
                        <h1>{this.props.title}</h1>
                    </div>
                    <div className="toolbar-container" />
                </div>
                <div className="app-body">
                    <div className="stencil-container" />
                    <div className="paper-container" />
                    <div className="inspector-container" />
                    <div className="navigator-container" />
                </div>
                <div ref={this.themePickerRef} className="theme-picker"></div>
      
            </div>
        );
    }
}

export default Diagram;
