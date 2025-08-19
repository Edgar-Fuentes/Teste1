                    import React from 'react';
                    import { Link, useLocation } from 'react-router-dom';

                    const NavBar = ({ darkMode, unreadCount = 0, pendingPayments = 0 }) => {
                      const location = useLocation();

                      const navItems = [
                        {
                          path: '/',
                          icon: '🏠',
                          label: 'Home',
                          isActive: location.pathname === '/'
                        },
                        {
                          path: '/jobs',
                          icon: '💼',
                          label: 'Jobs',
                          isActive: location.pathname.startsWith('/jobs')
                        },
                        {
                          path: '/messages',
                          icon: '💬',
                          label: 'Messages',
                          isActive: location.pathname === '/messages',
                          badge: unreadCount > 0 ? unreadCount : null
                        },
                        {
                          path: '/payments',
                          icon: '💳',
                          label: 'Payments',
                          isActive: location.pathname === '/payments',
                          badge: pendingPayments > 0 ? pendingPayments : null
                        },
                        {
                          path: '/profile',
                          icon: '👤',
                          label: 'Profile',
                          isActive: location.pathname === '/profile'
                        }
                      ];

                      return (
                        <nav className="app-footer" role="navigation" aria-label="Main navigation">
                          {navItems.map(item => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={item.isActive ? 'active' : ''}
                              style={{ position: 'relative' }}
                              aria-label={`${item.label}${item.badge ? ` (${item.badge} notifications)` : ''}`}
                            >
                              <span style={{ position: 'relative' }}>
                                {item.icon}
                                {/* Notification Badge */}
                                {item.badge && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '-8px', // Fixed: Added 'px' and closed the object
                                      right: '-8px',
                                      backgroundColor: '#ff3250',
                                      color: 'white',
                                      borderRadius: '50%',
                                      width: '18px',
                                      height: '18px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {item.badge}
                                  </div>
                                )}
                              </span>
                              {item.label}
                            </Link>
                          ))}
                        </nav>
                      );
                    };

                    export default NavBar;