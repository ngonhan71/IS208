import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function SubMenu({item}) {
    const [subnav, setSubnav] = useState(false);

    const showSubnav = () => setSubnav(!subnav);
    return (
        <div className="nav-item">
            <NavLink to={item.path} className="nav-link" onClick={item.subMenu && showSubnav}>
                <div>
                    {item?.icon}
                    <span>{item.title}</span>
                </div>
                <div className="icon-open">
                    {item.subMenu ? (subnav ?  item.iconOpened : item.iconClosed) : null}
                </div>
            </NavLink>
                {subnav &&
                    <div className="sub-nav">
                        {item.subMenu && item?.subMenu.map((item, index) => {
                            return (
                                <NavLink to={item.path} key={index} className="dropdown-link">
                                    {item?.icon}
                                    <span>{item.title}</span>
                                </NavLink>
                            );
                        })}
                    </div>
                }
        </div>
    )
}