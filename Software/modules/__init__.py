# =============================================================================
# KRUDER 1 - MODULES PACKAGE
# Backend modules separated by functionality.
# Lazy-loaded on first access for faster startup.
# =============================================================================

__all__ = [
    'AuthModule',
    'DashboardModule',
    'EventsModule',
    'EventModeModule',
    'PromptLabModule',
    'FramesModule',
    'SettingsModule'
]

def __getattr__(name):
    """Lazy-load modules on first access."""
    if name == 'AuthModule':
        from .auth import AuthModule
        return AuthModule
    if name == 'DashboardModule':
        from .dashboard import DashboardModule
        return DashboardModule
    if name == 'EventsModule':
        from .events import EventsModule
        return EventsModule
    if name == 'EventModeModule':
        from .eventmode import EventModeModule
        return EventModeModule
    if name == 'PromptLabModule':
        from .promptlab import PromptLabModule
        return PromptLabModule
    if name == 'FramesModule':
        from .frames import FramesModule
        return FramesModule
    if name == 'SettingsModule':
        from .settings import SettingsModule
        return SettingsModule
    raise AttributeError(f"module 'modules' has no attribute {name!r}")
