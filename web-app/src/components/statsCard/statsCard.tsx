import { Card, CardBody, CardHeader, Heading, Stack, StackDivider } from "@chakra-ui/react";
import { StatBox } from "../statBox/statBox";
import { useGraphStore } from "../../hook/useGraphStore";
import { useEffect, useState } from "react";
import { AnalyticsService } from "../../service/analyticsService";
import { isUserAdmin } from "../../types/user";

export const StatsCard = () => {
  const { graph } = useGraphStore();

  const [countNodes, setCountNodes] = useState<number>(0)

  const loadBaseInfo = async () => {
    try {
      const resposne = await AnalyticsService.GetBaseInfo();
      setCountNodes(resposne.countContacts);
    } catch (error) {
      const axiosError = error as Error;
      console.error(axiosError.message)
    }
  }

  useEffect(() => {
    loadBaseInfo()
  }, [graph]);


  return (
    <>
      {!isUserAdmin() ? (
        <Card margin="10px" alignItems={"center"}>
          <CardHeader>
            <Heading size="md">
              Статистика
            </Heading>
          </CardHeader>

          <CardBody>
            <Stack
              divider={<StackDivider />}
              display={'flex'}
              flexDirection={'column'}
              alignItems={"center"}
              minWidth={'50vw'}
              spacing="4"
            >
              <StatBox title="Количество контактов" content={countNodes.toString()} />
              <StatBox title="Количество групп" content="Text" />
            </Stack>
          </CardBody>
        </Card>
      ) : (
        <Card margin="10px" alignItems={"center"} ml={"30vw"}>
          <Heading size="md">
            Вы администратор
          </Heading>
        </Card>
      )}
    </>
  )
}