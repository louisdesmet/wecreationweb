import React, { useState } from "react";
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import evenementen from '../../img/profile/badges.png';
import get from '../../img/nav/get.png';
import diensten from '../../img/map/diensten.png';
import free from '../../img/profile/free.png';
import credit from '../../img/profile/credit.png';
import active from '../../img/map/filter-active.png';
import nonactive from '../../img/map/filter-nonactive.png';
import close from '../../img/map/close.png';
import workImage from '../../img/nav/work.png';

function Filters(props) {

    const [searchResults, setSearchResults] = useState(null);

    function searchItem(query) {
        const foundActivities = props.activities.data.filter((activity) => {
          const name = activity.name.toLowerCase();
          activity.type = "activity";
          return name.includes(query) && query !== "";
        });
        const foundBusinesses = props.businesses.data.filter((business) => {
          const name = business.name.toLowerCase();
          return business.type === "business" && name.includes(query) && query !== "";
        });
        const foundServices = props.businesses.data.filter((business) => {
          const name = business.name.toLowerCase();
          return business.type === "service" && name.includes(query) && query !== "";
        });
        const foundEvents = props.events.data.filter((event) => {
          const name = event.name.toLowerCase();
          event.type = "event";
          return name.includes(query) && query !== "";
        });
    
        const result = foundActivities.concat(foundBusinesses, foundServices, foundEvents);
        setSearchResults(result);
    }
    function clickResult(result) {
        props.setPosition({lat: parseFloat(result.lat), lng: parseFloat(result.lng)});
        props.setZoom(18);
    }

    function findIcon(type) {
    switch(type) {
        case "activity": return evenementen;
        break;
        case "business": return get;
        break;
        case "service": return diensten;
        break;
        case "event": return workImage;
        break;
    }
    }

    function clickDay() {
        props.setWeek(false);
        props.setToday(props.today ? false : true);
        props.setState([
          {
            startDate: null,
            endDate: new Date(""),
            key: 'selection'
          }
        ]);
    } 
    
    function clickWeek() {
        props.setToday(false);
        props.setWeek(props.week ? false : true);
        props.setState([
          {
            startDate: null,
            endDate: new Date(""),
            key: 'selection'
          }
        ]);
    }
    
    function clickDaterange(selection) {
        props.setState([selection]);
        props.setToday(false);
        props.setWeek(false);
    }
  
    return (
        <>
            {
                props.displayFilters ? <div className="filters">
                    <img onClick={() => {props.showMap()}} className="close" src={close} alt=""/>
                    <input onChange={e => searchItem(e.target.value)} type="text" placeholder="Zoeken..."/>
                    <div className="searchResults">
                    {
                        searchResults ? searchResults.map(result => <div key={result.type + result.id} onClick={e => clickResult(result)}><img src={findIcon(result.type)} alt=""/><span>{result.name}</span></div>) : null
                    }
                    </div>
                    <div className="time">
                    <div className={props.today ? "on" : ""} onClick={() => clickDay()}>Vandaag</div>
                    <div className={props.week ? "on" : ""} onClick={() => clickWeek()}>Deze week</div>
                    </div>
                    <DateRange
                    onChange={item => clickDaterange(item.selection)}
                    ranges={props.state}
                    />
                    <h2>Filters</h2>
                    <div className="categories">
                        <div>
                            <img src={evenementen} alt=""/>
                            <p>Activiteiten</p>
                        </div>
                        <img onClick={() => props.setActivity(!props.activity)} className="switch" src={props.activity ? active : nonactive} alt=""/>
                    </div>
                    <div className="categories">
                        <div>
                            <img src={get} alt=""/>
                            <p>Handelaars</p>
                        </div>
                        <img onClick={() => props.setBusiness(!props.business)} className="switch" src={props.business ? active: nonactive} alt=""/>
                    </div>
                    <div className="categories">
                        <div>
                            <img src={get} alt=""/>
                            <p>Diensten</p>
                        </div>
                        <img onClick={() => props.setService(!props.service)} className="switch" src={props.service ? active : nonactive} alt=""/>
                    </div>
                    <div className="categories">
                        <div>
                            <img src={free} alt=""/>
                            <p>Vrijwillig werk</p>
                        </div>
                        <img onClick={() => props.setFreeWork(!props.freeWork)} className="switch" src={props.freeWork ? active : nonactive} alt=""/>
                    </div>
                    <div className="categories">
                        <div>
                            <img src={credit} alt=""/>
                            <p>Credit werk</p>
                        </div>
                        <img onClick={() => props.setPaidWork(!props.paidWork)} className="switch" src={props.paidWork ? active : nonactive} alt=""/>
                    </div>
                </div> : null
            } 
        </>
    );
}

export default Filters;
