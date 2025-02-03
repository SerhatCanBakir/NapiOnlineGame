#include <napi.h>
#include <stdio.h>
#include "raylib.h"
#include <atomic>
#include <thread>

static std::thread gameThread;
static std::atomic<bool> isGameRunning(false);


static std::atomic<float> P1y(200);
static std::atomic<float> P2y(200);
static std::atomic<float> BallX(400);
static std::atomic<float> BallY(300);

static void GameLoop() {
    InitWindow(800, 600, "Online Pong ");
    SetTargetFPS(60);

    while (!WindowShouldClose() && isGameRunning.load()) {
        BeginDrawing();
        ClearBackground(RAYWHITE);

        // Çizimler
        DrawText("P1: UP/DOWN arrow  /   P2: W/S", 200, 10, 20, DARKGRAY);
        DrawRectangle(50, P1y.load(), 20, 100, BLACK);             // P1 raket
        DrawRectangle(730, P2y.load(), 20, 100, DARKGRAY);         // P2 raket
        DrawCircleV({BallX.load(), BallY.load()}, 10, RED);        // Top

        EndDrawing();
    }

    CloseWindow();
}

Napi::Value StartGame(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (!gameThread.joinable()) {
        isGameRunning.store(true);
        gameThread = std::thread(GameLoop);
    }
    return Napi::Boolean::New(env, true);
}

Napi::Value StopGame(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    isGameRunning.store(false);
    if (gameThread.joinable()) {
        gameThread.join();
    }
    return Napi::Boolean::New(env, true);
}


Napi::Value MoveLocalPlayer(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    if (info.Length() != 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env,"Oyuncu  numarası yok").ThrowAsJavaScriptException();
        return env.Null();
    }

    int player = info[0].As<Napi::Number>();

    if (player == 1) {
        
        if (IsKeyDown(KEY_UP))   { P1y.store(P1y.load() - 5); }
        if (IsKeyDown(KEY_DOWN)) { P1y.store(P1y.load() + 5); }

        
        float y = P1y.load();
        if (y < 0) y = 0;
        if (y > 500) y = 500; // 600-100=500
        P1y.store(y);
    }
    else if (player == 2) {
        
        if (IsKeyDown(KEY_W)) { P2y.store(P2y.load() - 5); }
        if (IsKeyDown(KEY_S)) { P2y.store(P2y.load() + 5); }

        
        float y = P2y.load();
        if (y < 0) y = 0;
        if (y > 500) y = 500;
        P2y.store(y);
    }

    return Napi::Boolean::New(env, true);
}

Napi::Value SetP1Pos(const Napi::CallbackInfo& info) {
    if (info.Length() == 1 && info[0].IsNumber()) {
        P1y.store(info[0].As<Napi::Number>());
    }
    return info.Env().Undefined();
}

Napi::Value SetP2Pos(const Napi::CallbackInfo& info) {
    if (info.Length() == 1 && info[0].IsNumber()) {
        P2y.store(info[0].As<Napi::Number>());
    }
    return info.Env().Undefined();
}

Napi::Value SetBallPos(const Napi::CallbackInfo& info){
    if(info.Length() == 2 && info[0].IsNumber() && info[1].IsNumber()){
        BallX.store(info[0].As<Napi::Number>());
        BallY.store(info[1].As<Napi::Number>());
    }
    return info.Env().Undefined();
}

Napi::Value GetGameInfo(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    Napi::Object obj = Napi::Object::New(env);
    obj.Set("P1Y", P1y.load());
    obj.Set("P2Y", P2y.load());
    obj.Set("Ballx", BallX.load());
    obj.Set("Bally", BallY.load());
    return obj;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    exports.Set("startGame", Napi::Function::New(env, StartGame));
    exports.Set("stopGame",  Napi::Function::New(env, StopGame));
    exports.Set("moveLocalPlayer", Napi::Function::New(env, MoveLocalPlayer));
    exports.Set("setP1Pos",  Napi::Function::New(env, SetP1Pos));
    exports.Set("setP2Pos",  Napi::Function::New(env, SetP2Pos));
    exports.Set("setBallPos",Napi::Function::New(env, SetBallPos));
    exports.Set("getGameInfo", Napi::Function::New(env, GetGameInfo));
    return exports;
}

NODE_API_MODULE(game_client, InitAll)
