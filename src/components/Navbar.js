import { AccountTree, MenuBook, OpenInNew, Science } from '@mui/icons-material';
import { AppBar, Box, Button, Toolbar, Tooltip, useTheme } from '@mui/material';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BioChefLogo from '../../img/BioChefWhite.svg';

const Navbar = () => {
    const theme = useTheme();
    const location = useLocation();
    const [navColor, setNavColor] = useState(theme.palette.primary.main);

    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;

    const buttonStyle = (active) => ({
        color: 'white',
        textTransform: 'none',
        fontSize: '1rem',
        marginRight: 2,
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -2,
            left: 0,
            width: active ? '100%' : '0%',
            height: 2,
            backgroundColor: 'white',
            transition: 'width 0.3s ease-in-out',
        },
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:after': {
                width: '100%',
            },
        },
    });

    // External link, kept apart from the in-app tabs and the institution logos
    const linkPillStyle = {
        color: 'white',
        textTransform: 'none',
        fontSize: '0.95rem',
        fontWeight: 500,
        borderRadius: 999,
        px: 1.75,
        py: 0.5,
        mr: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.24)',
        },
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            color='transparent'
            sx={{
                backgroundColor: navColor,
            }}
        >
            <Toolbar>
                {/* Logo */}
                <BioChefLogo
                    style={{ maxWidth: '75px', marginRight: '15px', cursor: 'pointer' }}
                    onClick={() => navigate('/about')}
                />

                {/* Links */}
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Button
                        component={Link}
                        to="/"
                        sx={buttonStyle(isActive('/'))}
                        startIcon={<Science />}
                    >
                        Tools
                    </Button>
                    <Button
                        component={Link}
                        to="/workflow"
                        sx={buttonStyle(isActive('/workflow'))}
                        startIcon={<AccountTree />}
                    >
                        Workflow Builder
                    </Button>
                </Box>

                {/* Right side logos */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        component="a"
                        href="https://home.biochef.app/workflows/#tutorials"
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<MenuBook />}
                        endIcon={<OpenInNew sx={{ fontSize: '0.9rem !important', opacity: 0.8 }} />}
                        sx={linkPillStyle}
                    >
                        Tutorials
                    </Button>

                    {/* IEETA logo */}
                    <Tooltip title="IEETA">
                        <a
                            href="https://www.ieeta.pt/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-block', marginRight: 26 }}
                        >
                            <img
                                src={'img/logo-ieeta.webp'}
                                alt="IEETA"
                                style={{ height: 38 }}
                            />
                        </a>
                    </Tooltip>

                    {/* UA logo */}
                    <Tooltip title="Universidade de Aveiro">
                        <a
                            href="https://www.ua.pt/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-block' }}
                        >
                            <img
                                src={'img/logo-ua.webp'}
                                alt="Universidade de Aveiro"
                                style={{ height: 38 }}
                            />
                        </a>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;