import {Button, CssBaseline, Divider, Drawer, Grid, makeStyles, MenuItem, MenuList} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
            zIndex: 0,
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
}));

const AppDrawer = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const usersSub = useSelector(state => state.subscribe.subscriptionUsers);

    let drawer = null;


    if (usersSub) {
        drawer = (
            <div>
                <div className={classes.toolbar}/>
                <Divider/>
                <MenuList>
                    {usersSub.map(name => (
                        <Grid key={'grid' + name._id}>
                            <MenuItem
                                key={name.id}
                            >
                                {name.displayName}
                                <Button

                                >
                                    Unsubscribe
                                </Button>
                            </MenuItem>
                            <Divider key={'divider' + name._id}/>
                        </Grid>
                    ))}
                </MenuList>
            </div>
        );
    }


    return (
        <div className={classes.drawer}>
            <CssBaseline/>
            <Drawer
                classes={{
                    paper: classes.drawerPaper,
                    zIndex: 0,
                }}
                variant="permanent"
                open
            >
                {drawer}
            </Drawer>
        </div>
    );
};

export default AppDrawer;
