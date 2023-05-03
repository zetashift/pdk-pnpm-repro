{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { self, nixpkgs, devenv, ... } @ inputs:
    let
      systems = [ "x86_64-linux" "i686-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin" ];
      forAllSystems = f: builtins.listToAttrs (map (name: { inherit name; value = f name; }) systems);
    in
    {
      devShells = forAllSystems
        (system:
          let
            pkgs = import nixpkgs {
              inherit system;
            };
          in
          {
            default = devenv.lib.mkShell {
              inherit inputs pkgs;
              modules = [
                {

                  # https://devenv.sh/reference/options/
                  packages = [  
                    pkgs.nodejs
                    pkgs.nodePackages_latest.pnpm
                    pkgs.jdk17_headless
                    pkgs.awscli2
                  ];

                  # Note all these are aliases for Nx under the hood
                  scripts.pj.exec = "pnpm projen"; # Synthesize .projen.ts project
                  scripts.ba.exec = "pnpm nx run-many --target=build --output-style=stream --nx-bail";  # Build all Nx workspaces
                  scripts.fd.exec = "pnpm nx run frontend:dev"; # Run frontend dev server

                  enterShell = ''
                    echo "Welcome to MIC dev shell!"
                  '';
                }
              ];
            };
          });
    };
}
