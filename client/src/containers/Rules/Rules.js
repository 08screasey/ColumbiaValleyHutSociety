import React, { useEffect } from 'react';
import './Rules.css';
import Hr from '../../components/UI/Hr/Hr';
import RuleList from '../../components/RuleList/RuleList';
import { RULES_DATA } from '../../Data/RULES_DATA';
import LatestAccessUpdates from '../../components/Widgets/LatestAccessUpdates/LatestAccessUpdates';

const Rules = (props) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    });

    return (
        <React.Fragment>
            <div className="Header-BG Rules"></div>
            <div className="RulesContainer container-fluid Grey-BG pb-5">
                <div className="row">
                    <div className="col-lg-8 pb-5">
                        <h2 className="Font0 DarkBlue mb-4 mt-3 TextOutline">Rules & Amenities</h2>

                        <RuleList {...RULES_DATA[0]}></RuleList>
                        <Hr />
                        <RuleList {...RULES_DATA[1]}></RuleList>
                        <Hr />
                        <RuleList {...RULES_DATA[2]}></RuleList>
                    </div>
                    <div className="col-lg-4 pt-4">
                        <LatestAccessUpdates />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Rules;
