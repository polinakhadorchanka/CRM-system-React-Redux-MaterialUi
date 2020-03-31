import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import VacancyList from "../VacancyList.jsx";
import Board from "../Board.jsx";
import ParsersTable from "../ParsersTable.jsx";
import FilterInput from "../FilterInput.jsx";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: 'transparent',
        minWidth: '1000px'
    },
}));

//theme.palette.background.paper

export default function SimpleTabs(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="All" {...a11yProps(0)} onClick={() => props.setNextCount(true, 'all')}/>
                    <Tab label="Unviewed" {...a11yProps(1)} onClick={() => props.setNextCount(true, 'unviewed')}/>
                    <Tab label="Board" {...a11yProps(2)} />
                    <Tab label="Parsers" {...a11yProps(3)} />
                    <FilterInput/>
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <VacancyList filter='all'/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <VacancyList filter='unviewed'/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Board/>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <ParsersTable/>
            </TabPanel>
        </div>
    );
}