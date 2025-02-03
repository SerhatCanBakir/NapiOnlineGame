{
  "targets": [
    {
      "target_name": "game_client",
      "sources": [
        "./client/Cppfiles/main.cpp",
      ],
      "include_dirs": [
        "<!(node -e \"require('node-addon-api').include\")",
        "C:/raylib/include"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').targets\"):node_addon_api"
      ],
      "libraries": [
        "C:/raylib/lib/raylib.lib",
        "opengl32.lib",
        "gdi32.lib",
        "winmm.lib",
        "user32.lib",
        "kernel32.lib",
        "shell32.lib",
        "advapi32.lib",
        "msvcrt.lib",
        "ucrt.lib"
      ],
      "defines": [
        "NAPI_CPP_EXCEPTIONS",
        "_CRT_SECURE_NO_WARNINGS",
        "_HAS_EXCEPTIONS=0",
        "_MT",
        "_DLL"
      ],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "RuntimeLibrary": 2
        }
      },
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ]
    }
  ]
}
