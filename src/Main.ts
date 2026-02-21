import { 
  waitForEvenAppBridge, 
  CreateStartUpPageContainer, 
  TextContainerProperty 
} from '@evenrealities/even_hub_sdk';

async function main() {
  const bridge = await waitForEvenAppBridge();

  const emptyContainer = new TextContainerProperty({
    containerID: 1,
    containerName: "main",
    xPosition: 0,
    yPosition: 0,
    width: 576,
    height: 288,
    content: " ",
    isEventCapture: 1
  });

  const pageConfig = new CreateStartUpPageContainer({
    containerTotalNum: 1,
    textObject: [emptyContainer]
  });

  await bridge.createStartUpPageContainer(pageConfig);
}

main().catch(console.error);
