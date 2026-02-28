# -*- mode: python ; coding: utf-8 -*-
# =============================================================================
# KRUDER 1 — PyInstaller Spec
# Build: pyinstaller kruder1.spec --clean --noconfirm
# =============================================================================

import os

block_cipher = None
BASE = os.path.abspath('.')

a = Analysis(
    ['main.py'],
    pathex=[BASE],
    binaries=[],
    datas=[
        ('index.html', '.'),
        ('static/css', 'static/css'),
        ('static/js', 'static/js'),
        ('static/fonts', 'static/fonts'),
        ('static/webfonts', 'static/webfonts'),
        ('static/img', 'static/img'),
        ('static/sounds', 'static/sounds'),
        ('static/locales', 'static/locales'),
        ('modules/*.html', 'modules'),
        ('modules/*.py', 'modules'),
        ('modules/__init__.py', 'modules'),
    ]
    + ([('config.json', '.')] if os.path.isfile('config.json') else []),
    hiddenimports=[
        'webview',
        'PIL',
        'PIL.Image',
        'PIL.ImageDraw',
        'PIL.ImageFont',
        'qrcode',
        'qrcode.image.pil',
        'requests',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['tkinter', 'unittest', 'test', 'setuptools'],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='Kruder1',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,              # windowed mode — no terminal
    icon='static/img/icon.ico',
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='Kruder1',
)
