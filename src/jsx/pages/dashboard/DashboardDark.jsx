import React, { useContext, useEffect } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { CommandPage } from './Home';

const DashboardDark = () => {
	const { changeBackground,	
		chnageSidebarColor,
        setHeaderIcon,
		changeNavigationHader
	} = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });
		changeNavigationHader('color_2');		
		chnageSidebarColor('color_2');		
        setHeaderIcon(true)
	}, []);
    return (
        <>
            <CommandPage />
        </>
    );
}
export default DashboardDark;