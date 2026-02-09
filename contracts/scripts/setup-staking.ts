import { ethers } from "hardhat";


async function main(){
    
    // 1. Setup inicial de cuentas y contratos
    const [signer] = await ethers.getSigners();
    const nftAddress = "0xFFEA2387762Fd2368c0CfCD0d2716757003c669a";
    const stakingAddress = "0xFd554DC848721C89d09Cb51696272EC040c142Ac";

    const nft = await ethers.getContractAt("GameItemNFT", nftAddress);
    const staking = await ethers.getContractAt("GameItemStaking", stakingAddress);

    // 2. Verificación de propiedad (Diagnóstico on-chain)
    const balance = await nft.balanceOf(signer.address);
    console.log(`Tu balance de NFTs: ${balance.toString()}`);

    if (balance > 0n) {
    // 3. Obtener el primer ID real que posees
    const tokenId = await nft.tokenOfOwnerByIndex(signer.address, 0);
    console.log(`Usando Token ID: ${tokenId.toString()}`);

    // 4. Aprobación (Paso crítico para staking custodial)
    console.log("Enviando aprobación...");
    const approveTx = await nft.approve(stakingAddress, tokenId);
    await approveTx.wait();
    console.log("Aprobación confirmada.");

    // 5. Staking (Enviando como array [id])
    console.log("Enviando a staking...");
    const stakeTx = await staking.stake([tokenId]);
    await stakeTx.wait();
    console.log("¡Staking exitoso! Ahora puedes ver los rewards en el frontend.");
    } else {
    console.log("Error: Tu cuenta no posee NFTs en este contrato para stakear.");
    }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});